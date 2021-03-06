import { useState } from "react";

export const useForm = (callback, initialState = {}) => {
  const [values, setValues] = useState({ initialState });

  const onChange = (event) => {
    // need to spread the existing value, otherwise it'll only overwrite one key attribute pair
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const onSubmit = (event) => {
    // prevent s browser reload/refresh
    event.preventDefault();
    // no more client side validation, we've done on the server side
    callback();
  };

  return {
    onChange,
    onSubmit,
    values,
  };
};
