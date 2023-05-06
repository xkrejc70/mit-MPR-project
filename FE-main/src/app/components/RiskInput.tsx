import { FieldAttributes, useField } from "formik";
import { ChangeEvent, FC } from "react";

interface IProps {
    label?: string;
    onChange?: (value: string | number) => void;
    onChangeRaw?: (event: ChangeEvent<HTMLInputElement>) => void;
    value?: string | number;
    className?: string;
    disabled?: boolean;
    type?: string;
    name?: string;
    error?: string;
    placeholder?: string;
}

export const RiskInput: FC<IProps> = ({ label, onChange, onChangeRaw, value, className, disabled, type = "text", name, error = "", placeholder }) => {
    return (
        <div className={`${className}`}>
            <div>{label}</div>
            <div className="mt-0.5 relative">
                <input
                    type={type}
                    id={"greinerInput" + name}
                    className={`w-full border-2 text-sm ${
                        error ? "border-red" : ""
                    }  focus:outline-none disabled:bg-transparent rounded-md p-2 disabled:opacity-100 text-gray-700 disabled:text-gray-600 focus:border-b-[#323e99]`}
                    onChange={(e) => {
                        if (onChange) onChange(e.target.value);
                        if (onChangeRaw) onChangeRaw(e);
                    }}
                    value={value}
                    disabled={disabled}
                    name={name}
                    autoComplete="off"
                    placeholder={placeholder}
                />
                {error != "" && <div className="text-red bottom-0 pt-1 absolute translate-y-full">{error}</div>}
            </div>
        </div>
    );
};

export const RiskInputFormik: FC<FieldAttributes<unknown> & { label?: string; required?: boolean }> = (props) => {
    const [field, meta] = useField(props);

    const errorMessage = meta.error && meta.touched ? meta.error : "";

    return (
        <RiskInput
            placeholder={props.placeholder}
            name={field.name}
            value={field.value as string}
            onChangeRaw={field.onChange}
            className={props.className}
            disabled={props.disabled}
            label={props.label}
            error={errorMessage}
            type={props.type}
        />
    );
};
