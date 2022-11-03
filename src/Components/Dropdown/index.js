import { noop } from "src/utils/misc";

const Dropdown = ({ children, onChange = noop, name = "", testId = '' }) => {
  return <select onChange={onChange} name={name} data-testid={testId}>
    {children}
  </select>;
};

export default Dropdown;
