import { back, router } from "./actions";
import {
  Action,
  ActionBar,
  ColContainr,
  FlexContainer,
  Form,
  FormItem,
  RowContainr,
  RowItem,
} from "./components";

import { Input as StringInput } from "./components/field/string";
import { Text as StringText } from "./components/field/string";
import { Radio as BooleanRadio } from "./components/field/boolean";

import { useAction, useComponent } from "./hooks";

export const initBundles = async () => {
  // view
  useComponent("form", Form);
  useComponent("form-item", FormItem);

  // layout
  useComponent("row-container", RowContainr);
  useComponent("row-item", RowItem);
  useComponent("flex-container", FlexContainer);
  useComponent("col-container", ColContainr);
  useComponent("action-bar", ActionBar);

  //field
  useComponent("string-input", StringInput);
  useComponent("boolean-radio", BooleanRadio);

  useComponent("string-text", StringText);

  //action
  useComponent("action", Action);

  useAction("back", back);
  useAction("router", router);
};
