import { IDropdownOption } from 'office-ui-fabric-react/lib/components/Dropdown';

export interface IPropertyPaneFieldOptionPanelProps {
 label: string;
 loadOptions: () => Promise<IDropdownOption[]>;
 onPropertyChange: (propertyPath: string, newValue: any) => void;
 selectedKey: string | number;
 disabled?: boolean;
}
