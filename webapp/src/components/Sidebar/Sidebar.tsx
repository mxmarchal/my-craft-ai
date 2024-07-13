import styled from "styled-components";
import Item from "../Item/Item";

const SiderbarUI = styled.div`
  display: flex;
  height: 100vh;
  width: 300px;
  border-left: 1px solid #c6c6c6;
  gap: 10px;
  flex-wrap: wrap;
  padding: 10px;
  overflow-y: scroll;
  align-content: flex-start;
`;

function Sidebar() {
  return (
    <SiderbarUI>
      <Item>🔥 fire</Item>
      <Item>💧 water</Item>
      <Item>🌍 earth</Item>
      <Item>💨 air</Item>
      <Item>💨 steam</Item>
      <Item>🌋 volcano</Item>
      <Item>🌋 eruption</Item>
      <Item>🌋 lava</Item>
      <Item>☁️ cloud</Item>
      <Item>💨 smoke</Item>
      <Item>🌫️ fog</Item>
      <Item>🌫️🌍 mist</Item>
      <Item>🌫️🌆 haze</Item>
    </SiderbarUI>
  );
}

export default Sidebar;
