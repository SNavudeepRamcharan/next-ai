import Sidebar from "../sidebar/Sidebar";

function MainLayout({ children }) {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#131314",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default MainLayout;