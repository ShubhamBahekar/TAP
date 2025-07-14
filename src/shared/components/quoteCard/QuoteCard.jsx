import React from 'react'
import { useContext} from "react";
import {Context} from "../../../Context/FocusFlowContext";

const QuoteCard = () => {

     const {isVisible,motivationalQuote,updateMotivationalQuote} = useContext(Context); 

  return (
    <div
      id="quote-card"
      data-observe
      className={`card mb-4 border-0 shadow-lg text-white transition-opacity ${
        isVisible["quote-card"] ? "opacity-100" : "opacity-50"
      }`}
      style={{
        background: "linear-gradient(135deg, #6f42c1 0%, #e83e8c 100%)",
        transition: "opacity 1s ease-in-out",
      }}
    >
      <div className="card-body text-center py-5">
        <div className="mb-4">
          <div
            className="d-inline-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: "60px",
              height: "60px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            }}
          >
            <span style={{ fontSize: "1.5rem" }}>🧘</span>
          </div>
        </div>
        <h2 className="h4 mb-4" style={{ opacity: 0.9 }}>
          Mindful Moment
        </h2>
        <blockquote className="blockquote">
          <p className="mb-3 fs-5 fst-italic">"{motivationalQuote}"</p>
        </blockquote>
        <button
          onClick={updateMotivationalQuote}
          className="btn btn-outline-light btn-sm"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderColor: "transparent",
          }}
        >
          ✨ New Quote
        </button>
      </div>
    </div>
  )
}

export default QuoteCard