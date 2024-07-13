import styled from "styled-components";
import Sidebar from "./components/Sidebar/Sidebar";
import Whiteboard from "./components/Whiteboard/Whiteboard";

const AppUI = styled.div`
  display: flex;
  width: 100vw;
`;

function App() {
  return (
    <AppUI>
      <Whiteboard />
      <Sidebar />
    </AppUI>
  );
}

export default App;
