import {
  back,
  complex,
  validate,
  submit,
  goto,
  insertOrUpdateOne,
} from "./actions";
import {
  Action,
  ActionBar,
  ColContainr,
  DataTable,
  FlexContainer,
  Form,
  FormItem,
  RowContainr,
  RowItem,
  Search,
  Table,
} from "./components";

import { Input as StringInput } from "./components/field/string";
import { MultiInput as StringMultiInput } from "./components";
import { Text as StringText } from "./components/field/string";
import { Radio as BooleanRadio } from "./components/field/boolean";
import { Select as EnumSelect } from "./components/field/enum";
import { Table as O2MTable } from "./components/field/o2m";

import { useAction, useComponent } from "./hooks";

export const initBundles = async () => {
  // view
  useComponent("form", Form);
  useComponent("data-table", DataTable);
  useComponent("search", Search);
  useComponent("table", Table);

  useComponent("form-item", FormItem);

  // layout
  useComponent("row-container", RowContainr);
  useComponent("row-item", RowItem);
  useComponent("flex-container", FlexContainer);
  useComponent("col-container", ColContainr);
  useComponent("action-bar", ActionBar);

  //field
  useComponent("string-input", StringInput);
  useComponent("string-multi-input", StringMultiInput);
  useComponent("boolean-radio", BooleanRadio);
  useComponent("o2m-table", O2MTable);

  useComponent("string-text", StringText);

  useComponent("enum-select", EnumSelect);

  //action
  useComponent("action", Action);

  useAction("back", back);
  useAction("goto", goto);
  useAction("complex", complex);
  useAction("validate", validate);
  useAction("insertOrUpdateOne", insertOrUpdateOne);

  useAction("submit", submit);
};
