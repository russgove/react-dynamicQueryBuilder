import { IDropdownOption } from 'office-ui-fabric-react/lib/components/Dropdown';

export interface IFieldOptionPanelState {
 loading: boolean;
 options: IDropdownOption[];
 error: string;
 showPanel:boolean;
}
