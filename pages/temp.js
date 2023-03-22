import { useParams } from "react-router";
const Temp = () => {
  const params = useParams();
  console.log(params);
  console.log("hello");
  return (
    <div className="outer">
      <div className="header">
        <h2>{params.person}hello
          nhfvduhiu</h2>
      </div>
    </div>
  );
};

export default Temp;
