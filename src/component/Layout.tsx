import Canvas from "./Canvas/Canvas";
import { Toolbar } from "./Tools";

const Layout = () => {
  return (
    <div className="w-screen h-screen flex">
      <Toolbar />
      <div className="flex-1 overflow-hidden">
        <Canvas width={window.innerWidth - 80} height={window.innerHeight} />
      </div>
    </div>
  );
};

export default Layout;
