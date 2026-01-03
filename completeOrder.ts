const completeOrder = async (address: string, paymentId: string) => {
  try {
    // Save to Firebase Cloud Database
    await addDoc(collection(db, "orders"), {
      items: cart,
      totalAmount: cartTotal,
      address: address,
      paymentId: paymentId,
      status: "Preparing", // Kitchen sees this
      timestamp: new Date()
    });

    // Clear local app state
    setShowAddressPicker(false);
    setOrderPlaced(true);
    setCart([]); 
    console.log("Order stored in cloud successfully!");
  } catch (e) {
    console.error("Error adding document: ", e);
    alert("Order failed to save. Please contact support.");
  }
};