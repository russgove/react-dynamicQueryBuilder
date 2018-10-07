import { IDropdownOption } from 'office-ui-fabric-react/lib/components/Dropdown';
import FieldOptions from "../../../model/FieldOptions";
export interface IFieldOptionPanelProps {
    label: string;
    onChanged: (option: IDropdownOption, index?: number) => void;
    listId: string;
    fieldOptions: Array<FieldOptions>
}
