import Canvas from "./Canvas/Canvas";
import Canvas_svg from "./Canvas/Canvas_svg";
import { Toolbar } from "./Tools";

const Layout = () => {
  return (
    <div className="w-screen h-screen flex">
      <Toolbar />
      <div className="flex-1 overflow-hidden">
        {/* <Canvas width={window.innerWidth } height={window.innerHeight} /> */}
        <Canvas_svg width={window.innerWidth } height={window.innerHeight} />
      </div>
    </div>
  );
};

export default Layout;
