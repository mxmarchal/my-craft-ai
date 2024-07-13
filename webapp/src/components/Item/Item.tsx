import styled from "styled-components";

const ItemUI = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid #c6c6c6;
  width: fit-content;
  height: fit-content;
  cursor: pointer;
`;

function Item({ children }: { children: string }) {
  return <ItemUI>{children}</ItemUI>;
}

export default Item;
