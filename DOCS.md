# Binota                                                                                                                                                                            
                                                                                                                                                                                      
  **What is Binota?**                                                                                                                                                                 
                                                                                                                                                                                      
  Binota is an integration of Liquity V2 running on the BNB Smart Chain blockchain. It is a decentralized and immutable borrowing protocol that allows users to deposit $BNB to mint  
  the Binota Stablecoin $B1.                                                                                                                                                          
                                                                                                                                                                                      
  The Binota app currently has 3 main uses:                                                                                                                                           
                                                                                                                                                                                      
  - Deposit $BNB to borrow $B1                                                                                                                                                        
  - Deposit $B1 mentioned above into Stability Pools to earn yield.                                                                                                                   
  - Stake BNT [Binota Token] to earn rewards and vote on LP gauges.                                                                                                                   
                                                                                                                                                                                      
  **Why Binota?**                                                                                                                                                                     
                                                                                                                                                                                      
  Liquity does not operate a central frontend to enhance the decentralization and resilience of the protocol. Binota is designed to be the primary integration of the Liquity V2      
  Protocol on BNB Smart Chain, providing users with the same reliability and freedom.                                                                                                 
                                                                                                                                                                                      
  ---                                                                                                                                                                                 
  # Troves                                                                                                                                                                            
                                                                                                                                                                                      
  ## What is a Trove?                                                                                                                                                                 
                                                                                                                                                                                      
  A Trove is Binota's version of a "vault." Each Trove is linked to an address on BNB Smart Chain, and each address can have multiple Troves.                                         
                                                                                                                                                                                      
  Each Trove enables you to manage a loan, adjusting collateral and debt values as necessary, while also allowing you to set your own interest rate.                                  
                                                                                                                                                                                      
  ## What types of collateral can I use?                                                                                                                                              
                                                                                                                                                                                      
  The following assets can be used with Binota:                                                                                                                                       
                                                                                                                                                                                      
  - BNB (Binance Coin)                                                                                                                                                                
                                                                                                                                                                                      
  ## Is there a minimum debt?                                                                                                                                                         
                                                                                                                                                                                      
  Yes, a minimum debt of 250 B1 is required for borrowing when opening a Trove.                                                                                                       
                                                                                                                                                                                      
  ## When do I need to pay back my loan?                                                                                                                                              
                                                                                                                                                                                      
  Loans issued by Binota do not have a repayment schedule. You can keep your Trove open and repay your debt at any time, as long as you maintain a healthy LTV (the amount of debt you
   can secure using your crypto as collateral).                                                                                                                                       
                                                                                                                                                                                      
  ## Is there a lockup period?                                                                                                                                                        
                                                                                                                                                                                      
  There is no lockup period; users can withdraw their collateral deposits at any time.                                                                                                
                                                                                                                                                                                      
  ## How do I decide on my LTV?                                                                                                                                                       
                                                                                                                                                                                      
  Ultimately, this depends on your personal preference—especially your risk tolerance and how actively you want to manage your position(s).                                           
                                                                                                                                                                                      
  The Collateral Ratio section within the Troves interface helps you select a percentage that determines how much you wish to borrow relative to your supplied collateral. If         
  collateral has already been entered, the borrow amount will automatically adjust based on the selected percentage.                                                                  
                                                                                                                                                                                      
  Next, the Interest Rate Slider allows you to choose the yearly interest rate you are willing to pay on the loan. Troves with lower interest rates are the first eligible for        
  redemption.                                                                                                                                                                         
                                                                                                                                                                                      
  The final section of the Troves interface displays key information such as:                                                                                                         
                                                                                                                                                                                      
  - Liquidation price                                                                                                                                                                 
  - Liquidation risk                                                                                                                                                                  
  - Redemption risk                                                                                                                                                                   
                                                                                                                                                                                      
  If your LTV becomes too high, your position will be liquidated.                                                                                                                     
                                                                                                                                                                                      
  ## How do Liquidations work in Binota?                                                                                                                                              
                                                                                                                                                                                      
  Troves are liquidated if their LTV exceeds the maximum allowed threshold.                                                                                                           
                                                                                                                                                                                      
  Binota primarily uses Stability Pools as its liquidation mechanism. Each borrow market has its own dedicated Stability Pool, which absorbs liquidated debt and collateral. In       
  return, Stability Pool depositors earn liquidation gains in the respective collateral asset.                                                                                        
                                                                                                                                                                                      
  A liquidated borrower typically incurs a 5% penalty and can claim any remaining collateral after liquidation.                                                                       
                                                                                                                                                                                      
  In cases where a Redistribution is required:                                                                                                                                        
                                                                                                                                                                                      
  - For BNB, the loss is 10% of the debt, corresponding to a maximum collateral loss of 9.09%                                                                                         
                                                                                                                                                                                      
  ## What is the max Loan-To-Value (LTV)?                                                                                                                                             
                                                                                                                                                                                      
  There is no maximum Loan-To-Value ratio imposed.                                                                                                                                    
                                                                                                                                                                                      
  ## What is the refundable gas deposit?                                                                                                                                              
                                                                                                                                                                                      
  To open a new Trove, the protocol requires a liquidation reserve of 1 BNB, regardless of the chosen collateral. This reserve is used to cover gas costs in the event of a           
  liquidation.                                                                                                                                                                        
                                                                                                                                                                                      
  The deposit is fully refunded when the Trove is closed by the user, including cases where it is closed via redemption.                                                              
                                                                                                                                                                                      
  ## Can I adjust the rate?                                                                                                                                                           
                                                                                                                                                                                      
  Yes, you can adjust your interest rate at any time. Since users set their own interest rates, you retain full control over your borrowing costs.                                    
                                                                                                                                                                                      
  A fee equal to 7 days of average interest is charged when opening a loan and for any interest rate adjustments made within 7 days of the previous adjustment.                       
                                                                                                                                                                                      
  This mechanism prevents low-interest borrowers from avoiding redemptions by temporarily adjusting rates around redemption events, which would unfairly shift redemptions toward     
  higher-interest borrowers.                                                                                                                                                          
                                                                                                                                                                                      
  ## How do I decide on the right rate for me?                                                                                                                                        
                                                                                                                                                                                      
  Your chosen interest rate determines your redemption risk and should align with your goals and how actively you plan to manage your position.                                       
                                                                                                                                                                                      
  Lower interest rates reduce borrowing costs but increase redemption risk and may require more frequent adjustments (and additional gas costs).                                      
                                                                                                                                                                                      
  Since redemptions occur in ascending order of interest rates for each collateral type, it is generally advisable to maintain a buffer of borrowers with lower rates ahead of you.   
                                                                                                                                                                                      
  Higher interest rates increase recurring loan costs but provide greater protection against redemptions and market volatility.                                                       
                                                                                                                                                                                      
  Monitoring historical redemption activity can help assess overall redemption risk. Active users or short-term borrowers may prefer lower rates, while passive or long-term borrowers
   may benefit from setting higher rates.                                                                                                                                             
                                                                                                                                                                                      
  ## What determines the riskiness of my Trove?                                                                                                                                       
                                                                                                                                                                                      
  Two primary parameters determine Trove risk:                                                                                                                                        
                                                                                                                                                                                      
  - Loan-to-Value (LTV): Affects liquidation risk based on your debt-to-collateral ratio                                                                                              
  - Interest Rate (IR): Set by the user and determines redemption risk                                                                                                                
                                                                                                                                                                                      
  You can configure these parameters independently for each Trove. Multiple Troves can be created under the same address, allowing you to manage different risk profiles across your  
  portfolio.                                                                                                                                                                          
                                                                                                                                                                                      
  ## Are there any other fees related to borrowing?                                                                                                                                   
                                                                                                                                                                                      
  At this time, there are no additional fees associated with borrowing.                                                                                                               
                                                                                                                                                                                      
  ## How many Troves (loans) can I open with the same address?                                                                                                                        
                                                                                                                                                                                      
  You can open multiple Troves using the same address, either for the same collateral type or across different collateral types. Each Trove is represented as a separate NFT.         
                                                                                                                                                                                      
  ## Am I able to loop my exposure?                                                                                                                                                   
                                                                                                                                                                                      
  Currently, Binota does not support looping deposited collateral.                                                                                                                    
                                                                                                                                                                                      
  ## How are collateral risks mitigated?                                                                                                                                              
                                                                                                                                                                                      
  Binota operates separate borrow markets for each supported collateral type, each with:                                                                                              
                                                                                                                                                                                      
  - Its own Stability Pool                                                                                                                                                            
  - User-defined interest rates                                                                                                                                                       
  - Asset-specific LTV parameters                                                                                                                                                     
                                                                                                                                                                                      
  As an emergency measure, a collateral shutdown mechanism can be triggered to preserve system stability during extreme market conditions.                                            
                                                                                                                                                                                      
  Despite these safeguards, B1 remains dependent on the supported collateral assets. There is no absolute guarantee of over-collateralization in the event of a sudden collapse of a  
  collateral asset.                                                                                                                                                                   
                                                                                                                                                                                      
  ## How does the system compartmentalize risk among different collaterals?                                                                                                           
                                                                                                                                                                                      
  Risk exposure varies by participant type:                                                                                                                                           
                                                                                                                                                                                      
  - Borrowers: Risk is limited to the specific collateral asset they supply                                                                                                           
  - B1 Holders: As a collateralized stablecoin, B1 depends on effective liquidations across all borrow markets and is exposed to all supported collateral assets                      
  - Earners: Stability Pool depositors are only exposed to the collateral asset they select, though they are still indirectly affected as B1 holders                                  
                                                                                                                                                                                      
  ## What mechanisms are in place if the Stability Pool is empty?                                                                                                                     
                                                                                                                                                                                      
  **SRC (Shutdown System Collateral Ratio):**                                                                                                                                         
                                                                                                                                                                                      
  If the system-wide Total Collateral Ratio (TCR) for a given collateral falls below the SRC threshold, the protocol shuts down that borrow market. All borrowing operations are      
  permanently disabled, except for closing existing Troves.                                                                                                                           
                                                                                                                                                                                      
  ---                                                                                                                                                                                 
  # B1 Token & Earn                                                                                                                                                                   
                                                                                                                                                                                      
  ## What is B1?                                                                                                                                                                      
                                                                                                                                                                                      
  B1 is the USD-pegged stablecoin issued by Binota. It is entirely decentralized, over-collateralized, and exclusively backed by BNB.                                                 
                                                                                                                                                                                      
  Unlike many competing stablecoins, B1 is designed with resilience at its core:                                                                                                      
                                                                                                                                                                                      
  - It is backed solely by crypto-native assets, with no reliance on real-world assets or centralized custodians.                                                                     
  - It remains unaffected by collateral composition changes or protocol upgrades, as it is fully immutable.                                                                           
  - It is directly redeemable, ensuring fast and liquid convertibility at all times.                                                                                                  
                                                                                                                                                                                      
  ## What are B1's main advantages compared to other stablecoins?                                                                                                                     
                                                                                                                                                                                      
  - B1 is backed exclusively by BNB Smart Chain-native assets — BNB — ensuring a trust-minimized foundation.                                                                          
  - It is always redeemable for its underlying collateral, maintaining a stable value by allowing users to swap it at a $1 equivalent at any time.                                    
  - The smart contracts that govern the issuance of B1 are immutable, preventing future alterations and significantly minimizing potential attack vectors.                            
  - B1 benefits from built-in incentives through Protocol Incentivized Liquidity (PIL), directed by governance, designed to attract liquidity for seamless transactions.              
                                                                                                                                                                                      
  ## What is B1's peg mechanism?                                                                                                                                                      
                                                                                                                                                                                      
  Binota's market-driven monetary policy — governed by user-defined interest rates — allows B1 to maintain its peg by dynamically adjusting to market conditions when the token trades
   above or below $1.                                                                                                                                                                 
                                                                                                                                                                                      
  When B1 trades above $1, borrowers generally lower their interest rates due to reduced redemption risk. This makes borrowing more attractive and holding B1 less appealing,         
  encouraging market activity that helps bring the price back down toward the peg.                                                                                                    
                                                                                                                                                                                      
  Conversely, when B1 trades below $1, arbitrageurs are incentivized to redeem it for its underlying collateral, helping to restore the peg. At the same time, increased redemption   
  risk prompts borrowers to raise interest rates, which in turn drives demand for B1 (and Earn deposits), exerting upward pressure on its price.                                      
                                                                                                                                                                                      
  ## How can I earn with Binota?                                                                                                                                                      
                                                                                                                                                                                      
  - Stability Pool Deposits: Deposit B1 into various Stability Pools to earn a share of protocol-generated revenue and liquidation gains. This section is the second of three         
  currently available sections in the Binota App.                                                                                                                                     
  - Stake BNT: Stake BNT to receive a portion of protocol revenue from Binota, while also gaining governance power to influence liquidity incentive allocation within the protocol.   
                                                                                                                                                                                      
  ## Where does the yield for Earn come from?                                                                                                                                         
                                                                                                                                                                                      
  The yield for Binota is derived from two primary sources:                                                                                                                           
                                                                                                                                                                                      
  - Interest Payments: Each borrow market allocates 50% of its revenue to its corresponding Stability Pool and 25% to BNT stakers. These payments are distributed to depositors       
  (Earners) in the form of B1.                                                                                                                                                        
  - Liquidation Gains: Deposited B1 is used to absorb under-collateralized positions, effectively acquiring collateral at an approximate 5% discount.                                 
                                                                                                                                                                                      
  All yield generated is entirely sustainable, scalable, and grounded in real economic activity — with no reliance on token emissions or lockups.                                     
                                                                                                                                                                                      
  ## Is there a lockup period?                                                                                                                                                        
                                                                                                                                                                                      
  There is no lockup period. Users are free to withdraw their B1 deposits at any time.                                                                                                
                                                                                                                                                                                      
  ## Why are there multiple Stability Pools?                                                                                                                                          
                                                                                                                                                                                      
  Multiple Stability Pools exist to serve two primary purposes:                                                                                                                       
                                                                                                                                                                                      
  - Independent Borrow Markets: Each collateral asset has its own dedicated borrow market with a market-driven interest rate. Separate Stability Pools allow the protocol to          
  dynamically allocate redemptions across supported collateral types, enabling a more flexible and efficient redemption process.                                                      
  - Risk Segmentation: By isolating collateral exposure, Stability Pools allow depositors to choose which assets they are comfortable being exposed to during liquidations. This      
  compartmentalizes risk and provides greater control over participation.                                                                                                             
                                                                                                                                                                                      
  ## How do risks differ for the different Stability Pools?                                                                                                                           
                                                                                                                                                                                      
  Users can allocate their B1 to the Stability Pool of their choice, aligning with their individual risk preferences and the specific collateral types they are comfortable being     
  exposed to.                                                                                                                                                                         
                                                                                                                                                                                      
  By choosing pools tied to particular collateral assets, participants can fine-tune their exposure and optimize for their desired risk–reward profile.                               
                                                                                                                                                                                      
  Offering distinct Stability Pools for different collateral assets ensures that the effects of liquidations in one asset class remain contained and do not spill over into the       
  broader system, supporting overall protocol stability.                                                                                                                              
                                                                                                                                                                                      
  However, it is important to note that all B1 holders — including Stability Pool depositors — ultimately rely on B1 maintaining its peg. As a result, they remain indirectly exposed 
  to the aggregate backing of all supported collaterals.                                                                                                                              
                                                                                                                                                                                      
  ## What happens when redemptions cause a Trove's debt to fall below the minimum amount?                                                                                             
                                                                                                                                                                                      
  If a redemption reduces a Trove's debt below the minimum required amount (for example, 2,000 B1), the outcome depends on the extent of the reduction.                               
                                                                                                                                                                                      
  **Fully Redeemed Trove (Debt reduced to 0):**                                                                                                                                       
                                                                                                                                                                                      
  If the redemption amount exceeds the entire debt, the Trove remains open with zero debt and any remaining collateral. The Trove owner may:                                          
                                                                                                                                                                                      
  - Close the Trove by withdrawing the remaining collateral, or                                                                                                                       
  - Re-borrow, bringing the debt back above the minimum threshold and adding more collateral if necessary.                                                                            
                                                                                                                                                                                      
  **Partially Redeemed Trove (Debt between 0 and 2,000 B1):**                                                                                                                         
                                                                                                                                                                                      
  If the redemption leaves the Trove with a residual debt below the minimum, the Trove also remains open with the remaining debt and collateral. In this case, the owner may:         
                                                                                                                                                                                      
  - Repay the remaining debt in full and withdraw their collateral to close the Trove, or                                                                                             
  - Borrow additional B1 to raise the debt above the required minimum, supplementing collateral if needed.                                                                            
                                                                                                                                                                                      
  ---                                                                                                                                                                                 
  # Redemptions                                                                                                                                                                       
                                                                                                                                                                                      
  ## What are Redemptions and how do they work?                                                                                                                                       
                                                                                                                                                                                      
  Redemptions play a vital role in maintaining B1's peg by establishing a decentralized price floor around $1—without reliance on centralized assets or third parties.                
                                                                                                                                                                                      
  A redemption involves exchanging B1 for its underlying collateral (BNB) at face value, treating 1 B1 as exactly $1. While redemptions can be initiated by anyone, they are only     
  profitable when B1 trades below $1.                                                                                                                                                 
                                                                                                                                                                                      
  During a redemption, the user sends B1 to the protocol and receives BNB, minus a redemption fee. The specific composition of collateral returned is determined by the current       
  distribution of assets within the Stability Pools.                                                                                                                                  
                                                                                                                                                                                      
  Redemptions first affect loans with the lowest interest rate.                                                                                                                       
                                                                                                                                                                                      
  ## What happens if two Troves have the same interest rate (IR)?                                                                                                                     
                                                                                                                                                                                      
  When two Troves share the same interest rate, the system applies a Last In, First Out (LIFO) rule. This means the Trove that most recently set its interest rate will be prioritized
   for redemption.                                                                                                                                                                    
                                                                                                                                                                                      
  ## When can redemptions occur?                                                                                                                                                      
                                                                                                                                                                                      
  Redemptions can take place at any time. However, they typically only occur when it is profitable to do so. This is generally the case when B1 is trading below $1 after accounting  
  for the current redemption fee.                                                                                                                                                     
                                                                                                                                                                                      
  ## Who can initiate a redemption?                                                                                                                                                   
                                                                                                                                                                                      
  Any address can initiate a redemption, provided that they have a sufficient amount of B1. However, redemptions are expected to be primarily performed by automated bots rather than 
  individual users.                                                                                                                                                                   
                                                                                                                                                                                      
  ## What happens if my Trove gets redeemed?                                                                                                                                          
                                                                                                                                                                                      
  A redemption functions as if another user is repaying a portion of your debt in exchange for receiving an equivalent amount of your collateral.                                     
                                                                                                                                                                                      
  If your collateral (BNB) is redeemed, the corresponding amount of your debt is paid off by the redeemer. In return, the redeemer receives a portion of your collateral minus the    
  redemption fee, which remains in your Trove.                                                                                                                                        
                                                                                                                                                                                      
  As a result, you do not incur a net loss in USD terms at the time of redemption. In fact, due to the retained redemption fee, you may experience a slight gain as the peg           
  stabilizes.                                                                                                                                                                         
                                                                                                                                                                                      
  ## How do redemptions work with multiple collateral assets?                                                                                                                         
                                                                                                                                                                                      
  B1 is collateralized by a diversified set of assets. To enhance economic safety and system resilience, Binota does not allow redeemers to freely choose which collateral to redeem. 
                                                                                                                                                                                      
  Instead, the protocol algorithmically distributes redemptions across a mix of supported collateral types, improving the overall backing quality of B1.                              
                                                                                                                                                                                      
  The process starts with the Troves paying the lowest interest rates in each collateral market and continues until the full amount of B1 is exchanged for collateral assets.         
                                                                                                                                                                                      
  Redemptions may be either partial or full, depending on the amount being redeemed and the availability of suitable Troves.                                                          
                                                                                                                                                                                      
  ## Is there a redemption fee?                                                                                                                                                       
                                                                                                                                                                                      
  Yes. Redemption fees exist in Binota and are designed with parameters that allow for faster fee decay over time.                                                                    
                                                                                                                                                                                      
  The fee is deducted as a percentage of the total collateral withdrawn during a redemption. In Binota, the redemption fee is retained within the system and returned to the affected 
  Trove owner as part of their remaining collateral, enhancing fairness and user alignment.                                                                                           
                                                                                                                                                                                      
  Redemption fees are determined by the `baseRate` variable, which is dynamically updated:                                                                                            
                                                                                                                                                                                      
  - The `baseRate` increases with each redemption event.                                                                                                                              
  - It decays exponentially over time since the last redemption, with a half-life of 6 hours.                                                                                         
                                                                                                                                                                                      
  **When a redemption of `x` B1 occurs:**                                                                                                                                             
                                                                                                                                                                                      
  - The `baseRate` is first decayed based on the time elapsed since the previous redemption-related event.                                                                            
  - It is then incremented proportionally by the redeemed amount relative to the total B1 supply (`x / total_B1_supply`).                                                             
                                                                                                                                                                                      
  The actual redemption fee percentage is calculated as:                                                                                                                              
                                                                                                                                                                                      
  `min(0.5% + baseRate × 100%)`                                                                                                                                                       
                                                                                                                                                                                      
  ## How can I stay protected from redemptions?                                                                                                                                       
                                                                                                                                                                                      
  Your exposure to redemption risk depends primarily on two factors: the interest rate you set and the market price of B1.                                                            
                                                                                                                                                                                      
  The interest rate assigned to your Trove determines its position in the redemption queue:                                                                                           
                                                                                                                                                                                      
  - A higher interest rate places your Trove further back in line, meaning more B1 must be redeemed before your position is affected.                                                 
  - A lower interest rate increases the likelihood that your Trove will be targeted earlier in the redemption process.                                                                
                                                                                                                                                                                      
  By managing your interest rate strategically, you can control your level of exposure and better protect your position.                                                              
                                                                                                                                                                                      
  The market price of B1 is the second key factor influencing redemption risk. When B1 trades above $1, redemptions are no longer profitable and are expected to cease. Strong market 
  demand can sustain prices above $1 for extended periods.                                                                                                                            
                                                                                                                                                                                      
  During such periods of elevated demand, you can safely lower the interest rate on your Trove without significantly increasing your exposure to redemptions.                         
                                                                                                                                                                                      
  ---                                                                                                                                                                                 
  # BNT Staking & Voting                                                                                                                                                              
                                                                                                                                                                                      
  ## What are the benefits of staking BNT?                                                                                                                                            
                                                                                                                                                                                      
  Staking BNT within Binota offers a dual-reward mechanism.                                                                                                                           
                                                                                                                                                                                      
  As a staker, you gain governance power to influence Protocol Incentivized Liquidity (PIL) while continuing to earn **25% of the protocol yield from borrowing fees**.               
                                                                                                                                                                                      
  This section is the third of three currently available sections in the Binota App.                                                                                                  
                                                                                                                                                                                      
  ## Is there a lock-up?                                                                                                                                                              
                                                                                                                                                                                      
  No, there is no lock-up. You can withdraw your BNT at any time.                                                                                                                     
                                                                                                                                                                                      
  Be aware, however, that withdrawing BNT results in the loss of any accumulated "extra" voting power.                                                                                
                                                                                                                                                                                      
  ## Vote on Incentives                                                                                                                                                               
                                                                                                                                                                                      
  Voting on incentives is a feature that will be introduced to Binota in the near future.                                                                                             
                                                                                                                                                                                      
  Additional details will be provided regarding:                                                                                                                                      
                                                                                                                                                                                      
  - Where incentives originate                                                                                                                                                        
  - How voting on incentives works                                                                                                                                                    
  - When votes must be cast                                                                                                                                                           
  - How initiatives are proposed and processed                                                                                                                                        
                                                                                                                                                                                      
  ## Can I stake more or partially reduce my BNT stake later?                                                                                                                         
                                                                                                                                                                                      
  Yes, you can both increase and partially reduce an existing BNT stake.                                                                                                              
                                                                                                                                                                                      
  When adding to an existing stake, the newly staked amount initially carries **zero voting power**. This design prevents potential abuse through short-term or flash-loan-like       
  staking behavior.                                                                                                                                                                   
                                                                                                                                                                                      
  As a result:                                                                                                                                                                        
                                                                                                                                                                                      
  - Your total voting power remains unchanged at the moment of re-staking.                                                                                                            
  - The rate of voting power accumulation (the slope) increases, reflecting the larger stake over time.                                                                               
                                                                                                                                                                                      
  When un-staking, there is an immediate reduction in voting power (a discontinuity), along with a decrease in the future accumulation rate.                                          
                                                                                                                                                                                      
  Notably, reducing your stake does **not** reset the age of the remaining portion. You retain the original staking age for the amount that remains staked.                           
                                                                                                                                                                                      
  ---                                                                                                                                                                                 
  # Contracts                                                                                                                                                                         
                                                                                                                                                                                      
  ## All Assets                                                                                                                                                                       
                                                                                                                                                                                      
  These are all Binota contracts within the BNB Smart Chain Network                                                                                                                   
                                                                                                                                                                                      
  ### Binota                                                                                                                                                                          
                                                                                                                                                                                      
  | Contract Name | Address |                                                                                                                                                         
  |---------------|---------|                                                                                                                                                         
  | B1 (Stablecoin) | `0x6349EBc7B4981d157aEF238DA70c2471421026D9` |                                                                                                                  
  | BNT | `0x8a8fcf302D3D0D57214EDF68952DA82d44C9D41c` |                                                                                                                              
                                                                                                                                                                                      
  ### Collaterals                                                                                                                                                                     
                                                                                                                                                                                      
  | Contract Name | Address |                                                                                                                                                         
  |---------------|---------|                                                                                                                                                         
  | WBNB | `0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c` |                                                                                                                             
                                                                                                                                                                                      
  ### Core & Governance                                                                                                                                                               
                                                                                                                                                                                      
  | Contract Name | Address |                                                                                                                                                         
  |---------------|---------|                                                                                                                                                         
  | HintHelpers | `0xD7261EcD80049fFaE712Dd8778B4fD4b6ACD6595` |                                                                                                                      
  | MultiTroveGetter | `0x0f23404E6Fdaa8fEcE4e31E0fd5ab41E086f3412` |                                                                                                                 
  | Governance | `0xa64750f0CFd43518C2410475973C286Ec38a40B8` |                                                                                                                       
  | CollateralRegistry | `0x7F46f57DBD322805538E317afe99AD61EF459c5e` |                                                                                                               
  | ExchangeHelpers | `0x2590c3bF037EB755740D34AbaFc795B161DDd2da` |                                                                                                                  
                                                                                                                                                                                      
  ### BNB                                                                                                                                                                             
                                                                                                                                                                                      
  | Contract Name | Address |                                                                                                                                                         
  |---------------|---------|                                                                                                                                                         
  | BNB_ActivePool | `0x85181B51bb4BFd78aC1F3B88f1a4d994fb840622` |                                                                                                                   
  | BNB_BorrowerOperations | `0x9646029a2779C9739c76925543BfF4398e22E8Ab` |                                                                                                           
  | BNB_CollSurplusPool | `0x3C4667DE2A4ef0abd943Df2dE64368404Ec32c02` |                                                                                                              
  | BNB_DefaultPool | `0xBBe6aDd04048F6750D1d504Ea2213F53EAbaff48` |                                                                                                                  
  | BNB_LeverageZapper | `0x194591b1187143f0B1b0D0bd3f70D47992b3aEa5` |                                                                                                               
  | BNB_PriceFeed | `0xb63a30DbF88b1838394e6600031e4C30D3B649C9` |                                                                                                                    
  | BNB_SortedTroves | `0x0c8DAD891C9E449C99A3DB06a6b2C8BdbfFA7857` |                                                                                                                 
  | BNB_StabilityPool | `0x4519296E9e8554bbBfd1E65dB2e96228E75428Fe` |                                                                                                                
  | BNB_TroveManager | `0x67148D1234C04025c285f573aD35f599735Bedb9` |                                                                                                                 
  | BNB_TroveNFT | `0xBDB3b4CcCD506776764118D736F60c2c9950F715` |                                                                                                                     
                                                                                                                                                                                      
  ### BNT (Staking & Airdrop) Contracts                                                                                                                                               
                                                                                                                                                                                      
  | Contract Name | Address |                                                                                                                                                         
  |---------------|---------|                                                                                                                                                         
  | BNT_Staking | `0x5a73bcf65862a02219618043c37BdF77c3FA7242` |                                                                                                                      
  | lzBNT_Token | `0x3f3a338b0213f3a5ee39a046d452ff3f875117c7` |                                                                                                                      
  | BNT_RewardsController | `0x23FbE81EE919081A6F9502AFaF8A9765b69Ca9f8` |                                                                                                            
  | BNT_MilestoneController | `0x5E1676479c3A40DD2b98d23dd3B53fc5806B577C` |                                                                                                          
                                                                                                                                                                                      
  ### Airdrop Adapters                                                                                                                                                                
                                                                                                                                                                                      
  | Contract Name | Address |                                                                                                                                                         
  |---------------|---------|                                                                                                                                                         
  | B1_VaultAdapter | `0x47356275E9569840b6C9b20c4e10270A68d37480` |                                                                                                                  
  | LP_Adapter_DexA | `0xc226A73a2Ab6471BA14C80aC8504211732768E17` |                                                                                                                  
  | SP_Adapter_BNB | `0xd4fC0AFb5487ac4901826DA90Df7D96fc2fc79E7` | 
