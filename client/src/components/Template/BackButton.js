// Dependencies
import React, { useNavigate } from "react-router-dom";

// Files
import "./BackButton.css";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <div>
      <button className="back-button" onClick={() => navigate(-1)}>
        &#x3c; BACK
      </button>
    </div>
  );
};

export default BackButton;
