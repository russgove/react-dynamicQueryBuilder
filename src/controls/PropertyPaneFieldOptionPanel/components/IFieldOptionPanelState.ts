import { IDropdownOption } from 'office-ui-fabric-react/lib/components/Dropdown';
import FieldOptions  from "../../../model/FieldOptions";
export interface IFieldOptionPanelState {
 loading: boolean;
 options: IDropdownOption[];
 error: string;
 showPanel:boolean;
 fieldOptions:Array<FieldOptions>;
}
