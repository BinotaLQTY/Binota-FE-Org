import { BigInt } from "@graphprotocol/graph-ts";
import {
  AllocateSTAToken as AllocateSTATokenEvent,
  DepositSTAToken as DepositSTATokenEvent,
  RegisterInitiative as RegisterInitiativeEvent,
  UnregisterInitiative as UnregisterInitiativeEvent,
  WithdrawSTAToken as WithdrawSTATokenEvent,
} from "../generated/Governance/Governance";
import {
  GovernanceAllocation,
  GovernanceAllocationIndex,
  GovernanceInitiative,
  GovernanceVotingPower,
} from "../generated/schema";

export function handleRegisterInitiative(event: RegisterInitiativeEvent): void {
  let initiative = new GovernanceInitiative(event.params.initiative.toHex());
  initiative.registered = true;
  initiative.save();
}

export function handleUnregisterInitiative(event: UnregisterInitiativeEvent): void {
  let initiative = GovernanceInitiative.load(event.params.initiative.toHex());
  if (initiative === null) {
    throw new Error("UnregisterInitiative event for non-existing initiative");
  }
  initiative.registered = false;
  initiative.save();
}

function getVotingPower(id: string): GovernanceVotingPower {
  let votingPower = GovernanceVotingPower.load(id);

  if (votingPower === null) {
    votingPower = new GovernanceVotingPower(id);
    votingPower.allocatedLQTY = BigInt.zero();
    votingPower.allocatedOffset = BigInt.zero();
    votingPower.unallocatedLQTY = BigInt.zero();
    votingPower.unallocatedOffset = BigInt.zero();
  }

  return votingPower;
}

export function handleDepositSTAToken(event: DepositSTATokenEvent): void {
  let userVotingPower = getVotingPower(event.params.user.toHex());
  let toteVotingPower = getVotingPower("total");

  let offsetIncrease = event.params.staTokenAmount.times(event.block.timestamp);
  userVotingPower.unallocatedLQTY = userVotingPower.unallocatedLQTY.plus(event.params.staTokenAmount);
  toteVotingPower.unallocatedLQTY = toteVotingPower.unallocatedLQTY.plus(event.params.staTokenAmount);
  userVotingPower.unallocatedOffset = userVotingPower.unallocatedOffset.plus(offsetIncrease);
  toteVotingPower.unallocatedOffset = toteVotingPower.unallocatedOffset.plus(offsetIncrease);

  userVotingPower.save();
  toteVotingPower.save();
}

export function handleWithdrawSTAToken(event: WithdrawSTATokenEvent): void {
  let userVotingPower = getVotingPower(event.params.user.toHex());
  let toteVotingPower = getVotingPower("total");

  let offsetDecrease = userVotingPower.unallocatedLQTY.notEqual(BigInt.zero())
    ? userVotingPower.unallocatedOffset
      .times(event.params.staTokenAmount)
      .div(userVotingPower.unallocatedLQTY)
    : BigInt.zero();

  userVotingPower.unallocatedLQTY = userVotingPower.unallocatedLQTY.minus(event.params.staTokenAmount);
  toteVotingPower.unallocatedLQTY = toteVotingPower.unallocatedLQTY.minus(event.params.staTokenAmount);
  userVotingPower.unallocatedOffset = userVotingPower.unallocatedOffset.minus(offsetDecrease);
  toteVotingPower.unallocatedOffset = toteVotingPower.unallocatedOffset.minus(offsetDecrease);

  userVotingPower.save();
  toteVotingPower.save();
}

class GovernanceAllocationAndIndex {
  allocation: GovernanceAllocation;
  allocationIndex: GovernanceAllocationIndex | null;

  constructor(allocation: GovernanceAllocation, allocationIndex: GovernanceAllocationIndex | null) {
    this.allocation = allocation;
    this.allocationIndex = allocationIndex;
  }

  save(): void {
    this.allocation.save();

    // Workaround for AssemblyScript compiler being stupid
    let allocationIndex = this.allocationIndex;
    if (allocationIndex !== null) allocationIndex.save();
  }
}

function getAllocation(
  userId: string | null,
  initiativeId: string,
  epoch: BigInt,
): GovernanceAllocationAndIndex {
  let allocationIndexId = userId !== null ? userId + ":" + initiativeId : initiativeId;
  let allocationIndex: GovernanceAllocationIndex | null = null;
  let allocationId = allocationIndexId + ":" + epoch.toString();
  let allocation = GovernanceAllocation.load(allocationId);

  if (allocation === null) {
    allocation = new GovernanceAllocation(allocationId);
    allocation.user = userId;
    allocation.initiative = initiativeId;
    allocation.epoch = epoch;

    allocationIndex = GovernanceAllocationIndex.load(allocationIndexId);
    if (allocationIndex === null) {
      allocationIndex = new GovernanceAllocationIndex(allocationIndexId);
      allocationIndex.user = userId;
      allocationIndex.initiative = initiativeId;

      allocation.voteLQTY = BigInt.zero();
      allocation.vetoLQTY = BigInt.zero();
      allocation.voteOffset = BigInt.zero();
      allocation.vetoOffset = BigInt.zero();
    } else {
      let prevAllocation = GovernanceAllocation.load(allocationIndex.latestAllocation);
      if (prevAllocation === null) {
        throw new Error("GovernanceAllocation not found: " + allocationIndex.latestAllocation);
      }

      allocation.voteLQTY = prevAllocation.voteLQTY;
      allocation.vetoLQTY = prevAllocation.vetoLQTY;
      allocation.voteOffset = prevAllocation.voteOffset;
      allocation.vetoOffset = prevAllocation.vetoOffset;
    }

    allocationIndex.latestAllocation = allocationId;
  }

  return new GovernanceAllocationAndIndex(allocation, allocationIndex);
}

export function handleAllocateSTAToken(event: AllocateSTATokenEvent): void {
  let userId = event.params.user.toHex();
  let initiativeId = event.params.initiative.toHex();

  let userVotingPower = getVotingPower(userId);
  let toteVotingPower = getVotingPower("total");

  let user = getAllocation(userId, initiativeId, event.params.atEpoch);
  let tote = getAllocation(null, initiativeId, event.params.atEpoch);

  let deltaVoteOffset = event.params.deltaVoteSTAToken.gt(BigInt.zero())
    ? (userVotingPower.unallocatedLQTY.notEqual(BigInt.zero())
      ? userVotingPower.unallocatedOffset.times(event.params.deltaVoteSTAToken).div(userVotingPower.unallocatedLQTY)
      : BigInt.zero())
    : (user.allocation.voteLQTY.notEqual(BigInt.zero())
      ? user.allocation.voteOffset.times(event.params.deltaVoteSTAToken).div(user.allocation.voteLQTY)
      : BigInt.zero());

  let deltaVetoOffset = event.params.deltaVetoSTAToken.gt(BigInt.zero())
    ? (userVotingPower.unallocatedLQTY.notEqual(BigInt.zero())
      ? userVotingPower.unallocatedOffset.times(event.params.deltaVetoSTAToken).div(userVotingPower.unallocatedLQTY)
      : BigInt.zero())
    : (user.allocation.vetoLQTY.notEqual(BigInt.zero())
      ? user.allocation.vetoOffset.times(event.params.deltaVetoSTAToken).div(user.allocation.vetoLQTY)
      : BigInt.zero());

  user.allocation.voteLQTY = user.allocation.voteLQTY.plus(event.params.deltaVoteSTAToken);
  tote.allocation.voteLQTY = tote.allocation.voteLQTY.plus(event.params.deltaVoteSTAToken);
  user.allocation.vetoLQTY = user.allocation.vetoLQTY.plus(event.params.deltaVetoSTAToken);
  tote.allocation.vetoLQTY = tote.allocation.vetoLQTY.plus(event.params.deltaVetoSTAToken);

  userVotingPower.allocatedLQTY = userVotingPower.allocatedLQTY.plus(event.params.deltaVoteSTAToken);
  toteVotingPower.allocatedLQTY = toteVotingPower.allocatedLQTY.plus(event.params.deltaVoteSTAToken);
  userVotingPower.allocatedLQTY = userVotingPower.allocatedLQTY.plus(event.params.deltaVetoSTAToken);
  toteVotingPower.allocatedLQTY = toteVotingPower.allocatedLQTY.plus(event.params.deltaVetoSTAToken);

  userVotingPower.unallocatedLQTY = userVotingPower.unallocatedLQTY.minus(event.params.deltaVoteSTAToken);
  toteVotingPower.unallocatedLQTY = toteVotingPower.unallocatedLQTY.minus(event.params.deltaVoteSTAToken);
  userVotingPower.unallocatedLQTY = userVotingPower.unallocatedLQTY.minus(event.params.deltaVetoSTAToken);
  toteVotingPower.unallocatedLQTY = toteVotingPower.unallocatedLQTY.minus(event.params.deltaVetoSTAToken);

  user.allocation.voteOffset = user.allocation.voteOffset.plus(deltaVoteOffset);
  tote.allocation.voteOffset = tote.allocation.voteOffset.plus(deltaVoteOffset);
  user.allocation.vetoOffset = user.allocation.vetoOffset.plus(deltaVetoOffset);
  tote.allocation.vetoOffset = tote.allocation.vetoOffset.plus(deltaVetoOffset);

  userVotingPower.allocatedOffset = userVotingPower.allocatedOffset.plus(deltaVoteOffset);
  toteVotingPower.allocatedOffset = toteVotingPower.allocatedOffset.plus(deltaVoteOffset);
  userVotingPower.allocatedOffset = userVotingPower.allocatedOffset.plus(deltaVetoOffset);
  toteVotingPower.allocatedOffset = toteVotingPower.allocatedOffset.plus(deltaVetoOffset);

  userVotingPower.unallocatedOffset = userVotingPower.unallocatedOffset.minus(deltaVoteOffset);
  toteVotingPower.unallocatedOffset = toteVotingPower.unallocatedOffset.minus(deltaVoteOffset);
  userVotingPower.unallocatedOffset = userVotingPower.unallocatedOffset.minus(deltaVetoOffset);
  toteVotingPower.unallocatedOffset = toteVotingPower.unallocatedOffset.minus(deltaVetoOffset);

  userVotingPower.save();
  toteVotingPower.save();

  user.save();
  tote.save();
}
