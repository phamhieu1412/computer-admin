import logo from "../../images/logo_admin.png";

const Header = (props) => {
  return (
    <div style={{ backgroundColor: "#fbfbfb", display: "flex" }}>
      <div
        style={{
          display: 'flex',
          width: 200,
          fontSize: 24,
          color: "#007bff",
          fontWeight: "bold",
          lineHeight: "60px",
          justifyContent: "center",
          alignItems: 'center',
        }}
      >
        <img src={logo} width={80} />
      </div>
      <div style={{ flex: 1, textAlign: "right", lineHeight: "60px" }}>
        <i
          style={{
            borderRight: "1px solid #ddd",
            lineHeight: "40px",
            padding: "0 15px 0 15px",
            color: "#777",
          }}
          className="fa fa-bell"
        ></i>
        <i
          style={{
            borderRight: "1px solid #ddd",
            lineHeight: "40px",
            padding: "0 15px 0 15px",
            color: "#777",
          }}
          className="fa fa-list"
        ></i>
        <i
          style={{ padding: "0 40px 0 15px", color: "#777" }}
          className="fa fa-user"
        ></i>
      </div>
    </div>
  );
};

export default Header;
