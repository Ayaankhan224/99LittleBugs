import React from "react";
import { TransitionLink, useTransition } from "./Loading";
import { useAuth } from "../context/AuthContext";

const Pricing = () => {
  const { user, updateLocalPlan } = useAuth();
  const { transitionTo } = useTransition();

  const selectPlan = async (planName) => {
    if (!user) {
      alert("Please log in or sign up to select a plan.");
      transitionTo("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/plan", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`,
        },
        body: JSON.stringify({ plan: planName }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to select plan");
      }

      updateLocalPlan(planName);

      alert(`Successfully chosen ${planName.toUpperCase()} plan!`);

      transitionTo("/form");
    } catch (err) {
      console.error("Select plan error:", err);
      alert(err.message || "Something went wrong. Please try again.");
    }
  };

  const handlePayment = async (amount) => {
    console.log("Clicked", amount);
    if (!user) {
      alert("Please log in or sign up to select a plan.");
      transitionTo("/login");
      return;
    }

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

          selectPlan("premium");
        },
      };
      
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error(err);
      alert("Order creation failed. Check if backend is running.");
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-evenly capitalize font-[poppins]">
      <div className="bg-white w-[30%] h-[90%] rounded-4xl flex flex-col justify-between items-center shadow-[0_12px_25px_rgba(0,0,0,0.25)]">
        <div className="h-[50%] w-full rounded-4xl shadow-[0_12px_25px_rgba(0,0,0,0.25)] z-10 p-3">
          <div className="h-[60%] w-full rounded-4xl bg-[#CEC5C3] p-6 flex flex-col justify-between">
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
            <button 
              onClick={() => selectPlan("free")} 
              className="h-[40%] w-full bg-black rounded-4xl text-white flex justify-center items-center hover:scale-101 cursor-pointer duration-300 ease-out hover:bg-[#E56E3A]"
            >
              Choose Free Plan
            </button>
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
        <div className="h-[50%] w-full rounded-4xl shadow-[0_12px_25px_rgba(0,0,0,0.25)] z-10 p-3">
          <div className="h-[60%] w-full rounded-4xl bg-[#B8C3C1] p-6 flex flex-col justify-between">
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
            <button 
              onClick={() => handlePayment(39)} 
              className="h-[40%] w-full bg-black rounded-4xl text-white flex justify-center items-center hover:scale-101 cursor-pointer duration-300 ease-out hover:bg-[#E56E3A]"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
        <div className="h-[50%] w-full rounded-b-4xl py-12 px-6">
          <ul className="flex flex-col h-full w-full font-[poppins] font-medium gap-3">
            <li>No resume limit</li>
            <li>Deep candidate ranking</li>
            <li>Export reports</li>
          </ul>
        </div>
      </div>

      <div className="bg-white w-[30%] h-[90%] rounded-4xl flex flex-col justify-between items-center shadow-[0_12px_25px_rgba(0,0,0,0.25)]">
        <div className="h-[50%] w-full rounded-4xl shadow-[0_12px_25px_rgba(0,0,0,0.25)] z-10 p-3">
          <div className="h-[60%] w-full rounded-4xl bg-[#BDA79A] p-6 flex flex-col justify-between">
            <h3 className="font-[poppins] bg-white w-fit px-3 py-1 rounded-4xl">
              ENTERPRISE
            </h3>
            <h1 className="text-2xl font-[poppins]">
              <span className="text-6xl">Contact</span>&nbsp;&nbsp; Sales
            </h1>
          </div>
          <div className="h-[40%] w-full flex-col flex justify-between">
            <h6 className="font-[poppins] p-3 font-light">
              For Large organizations
            </h6>
            <TransitionLink 
              to="/contact" 
              className="h-[40%] w-full bg-black rounded-4xl text-white flex justify-center items-center hover:scale-101 cursor-pointer duration-300 ease-out hover:bg-[#E56E3A]"
            >
              Contact
            </TransitionLink>
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
