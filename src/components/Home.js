import React from "react";
import InputField from "./InputField";
import Tags from "./Tags";

const Home = () => {
  return (
    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
      <InputField />
      <Tags />
    </div>
  );
};
export default Home;
