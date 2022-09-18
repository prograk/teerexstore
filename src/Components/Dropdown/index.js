import { noop } from "src/utils/misc";

const Dropdown = ({ children, onChange = noop, name = "" }) => {
  return <select onChange={onChange} name={name}>{children}</select>;
};

export default Dropdown;
