import React from "react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const handlePayment = async (amount) => {
    console.log("Clicked", amount);
    try {
      const response = await fetch("http://localhost:5000/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      const order = await response.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: order.amount,
        currency: order.currency,
        order_id: order.id,

        name: "Anker",
        description: "Premium Plan",

        handler: function (response) {
          alert("Payment Successful!");

          console.log("Payment ID:", response.razorpay_payment_id);
          console.log("Order ID:", response.razorpay_order_id);
        },
      };
      const razorpay = new window.Razorpay(options);

      razorpay.open();
    } catch (err) {
      console.error(err);
    }
  }


  return (
    <div className="h-screen w-screen flex items-center justify-evenly capitalize">
      <div className="bg-white w-[30%] h-[90%] rounded-4xl flex flex-col justify-between items-center shadow-[0_12px_25px_rgba(0,0,0,0.25)]">
        <div className="h-[50%] w-full rounded-4xl  shadow-[0_12px_25px_rgba(0,0,0,0.25)] z-10 p-3">
          <div className="h-[60%] w-full rounded-4xl bg-[#b7adad] p-6 flex flex-col justify-between">
            <h3 className="font-[poppins] bg-white w-fit px-3 py-1 rounded-4xl">
              FREE
            </h3>
            <h1 className="text-2xl font-[poppins]">
              <span className="text-6xl">$0</span>/month
            </h1>
          </div>
          <div className="h-[40%] w-full flex-col flex justify-between">
            <h6 className="font-[poppins] p-3 font-light">
              Perfect For Small teams
            </h6>
            <div className="h-[40%] w-full bg-black rounded-4xl text-white flex justify-center items-center hover:scale-101 cursor-pointer duration-300 ease-out hover:bg-[#E56E3A]">
              Proceed to Payment
            </div>
          </div>
        </div>
        <div className="h-[50%] w-full rounded-b-4xl py-12 px-6">
          <ul className="flex flex-col h-full w-full font-[poppins] font-medium gap-3">
            <li>50 resume limit</li>
            <li>Basic candidate ranking</li>
            <li>Top 5 candidates shown</li>
          </ul>
        </div>
      </div>
      <div className="bg-white w-[30%] h-[90%] rounded-4xl flex flex-col justify-between items-center shadow-[0_12px_25px_rgba(0,0,0,0.25)]">
        <div className="h-[50%] w-full rounded-4xl  shadow-[0_12px_25px_rgba(0,0,0,0.25)] z-10 p-3">
          <div className="h-[60%] w-full rounded-4xl bg-[#adb7b7] p-6 flex flex-col justify-between">
            <h3 className="font-[poppins] bg-white w-fit px-3 py-1 rounded-4xl">
              PREMIUM
            </h3>
            <h1 className="text-2xl font-[poppins]">
              <span className="text-6xl">$39</span>/month
            </h1>
          </div>
          <div className="h-[40%] w-full flex-col flex justify-between">
            <h6 className="font-[poppins] p-3 font-light">
              Perfect For Growing teams
            </h6>
            <div onClick={() => handlePayment(39)} className="h-[40%] w-full bg-black rounded-4xl text-white flex justify-center items-center hover:scale-101 cursor-pointer duration-300 ease-out hover:bg-[#E56E3A]">
              Proceed to Payment
            </div>
          </div>
        </div>
        <div className="h-[50%] w-full rounded-b-4xl py-12 px-6">
          <ul className="flex flex-col h-full w-full font-[poppins] font-medium gap-3">
            <li>No resume limit</li>
            <li>Deep candidate ranking</li>
            <li>AI interview questions</li>
            <li>Export reports</li>
          </ul>
        </div>
      </div>
      <div className="bg-white w-[30%] h-[90%] rounded-4xl flex flex-col justify-between items-center shadow-[0_12px_25px_rgba(0,0,0,0.25)]">
        <div className="h-[50%] w-full rounded-4xl  shadow-[0_12px_25px_rgba(0,0,0,0.25)] z-10 p-3">
          <div className="h-[60%] w-full rounded-4xl bg-[#b7adb6] p-6 flex flex-col justify-between">
            <h3 className="font-[poppins] bg-white w-fit px-3 py-1 rounded-4xl">
              ENTERPRISE
            </h3>
            <h1 className="text-2xl font-[poppins]">
              <span className="text-6xl">$99</span>/month
            </h1>
          </div>
          <div className="h-[40%] w-full flex-col flex justify-between">
            <h6 className="font-[poppins] p-3 font-light">
              For Large organizations
            </h6>
            <div onClick={() => handlePayment(99)} className="h-[40%] w-full bg-black rounded-4xl text-white flex justify-center items-center hover:scale-101 cursor-pointer duration-300 ease-out hover:bg-[#E56E3A] ">
              Proceed to Payment
            </div>
          </div>
        </div>
        <div className="h-[50%] w-full rounded-b-4xl py-12 px-6">
          <ul className="flex flex-col h-full w-full font-[poppins] font-medium gap-3">
            <li>Everything in premium</li>
            <li>Shared analysis</li>
            <li>API</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
