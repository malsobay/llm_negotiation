const tableBuyer = `Buyer: You are interested in buying a used table that you recently saw advertised by an individual. You are about to meet with the seller of the used table to discuss the price. 

Important facts: 
• Imagine that you have already seen the table and it’s in excellent condition.
• This kind of table used to sell for $300 new, but new ones are no longer available.
• A local furniture store is selling the same kind of table (used) for $190.
• Try to buy the table for as little money as possible.
• You do not have to reach an agreement. If you don’t reach an agreement, you will buy a used table from the furniture store for $190.`;

const tableSeller = `Seller: You are moving and would like to sell a table that you no longer need. You posted an advertisement and one possible buyer has contacted you. You are about to meet with this possible buyer to discuss the price.

Important facts:
• The table is in excellent condition and has already been seen by the buyer.
• You bought the table new from a local furniture store for $300.
• The same furniture store offered to buy back the used table for $90.
• Try to sell the table for as much money as possible.
• You do not have to reach an agreement. If you don’t reach an agreement, you will sell the table to the furniture store for $90.`;

const instructions = {
  tableBuyer,
  tableSeller,
};

export default instructions;
