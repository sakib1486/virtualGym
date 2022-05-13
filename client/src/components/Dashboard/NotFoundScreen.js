import React from "react";
import "./NotFoundScreen.css";

const NotFoundScreen = () => {
  return (
    <div
      id="oopss"
      style={{
        flexGrow: 6,
        minWidth: "50vw",
        maxWidth: "80vw",
        height: "55vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div id="error-text">
        <img
          src="https://cdn.rawgit.com/ahmedhosna95/upload/1731955f/sad404.svg"
          alt="404"
        />
        <p className="p-a">
          !Sorry, we couldn&apos;t find what you are looking for. Please try
          again
        </p>
      </div>
    </div>
  );
};

export default NotFoundScreen;
