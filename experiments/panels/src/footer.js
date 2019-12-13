import styled from 'styled-components';

export default styled.div`
  scroll-snap-align: end;
  background-color: black;
  position: ${props => props.top ? 'absolute' : 'relative'};
  top: ${props => props.top ? props.top : 'unset'};
  height: 70vh;
  width: 100vw;
  &::before {
    content: "";
    position: absolute;
    top: 10vh;
    height: 20vh;
    width: 80vw;
    left: 50%;
    transform: translateX(-50%);
    background-color: white;
  }
`;
