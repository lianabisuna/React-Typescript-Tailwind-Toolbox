import { HtmlHTMLAttributes, useState } from "react";
import { ClassBinding, InputVariant, OptionProp, TailwindColor } from "./types";
import AppFormContainer from "./AppFormContainer";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import AppChip from "./AppChip";

export default function AppFormSelect(props: Prop) {
	/** CONTAINER PROPS */

	const containerProps = () => {
		const { color, error, success, label, required, message, disabled, size, variant, float, block } = props;

		return { color, error, success, label, required, message, disabled, size, variant, float, block };
	}


	/** FILTERED ITEMS */

	const filteredItems = () => {
		const _items = [ ...props.items as OptionProp[] ];
		return _items.map((item: OptionProp) => {
			if (typeof item === 'string')
				return { text: item, value: item }
			else
				return item
		})
	};


	/** FILTER MODEL VALUE */

	const filteredModelValue = () => {
		if (!props.modelValue) return ''

		const _items = [ ...props.items as OptionProp[] ];
		if (!props.multiple) {
			const index = _items.findIndex(e => e.value === props.modelValue);
			if (index < 0) return
			return _items[index].text
		}
		else {
			if (!Array.isArray(props.modelValue)) return
			const modelValueArr: string[] = []
			_items.map((e: any) => {
				if (props.modelValue?.includes(e.value)) {
					modelValueArr.push(e.text)
				}
			})
			return props.chip ? modelValueArr : modelValueArr.join(', ')
		}
	}


	/** UPDATE MODEL VALUE */

	const updateModelValue = (value: any, index: number) => {
		if (!props.multiple) {
			props.updateModelValue && props.updateModelValue(value);
		}
		else {
			const modelValueProps = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
			if (modelValueProps.includes(value)) {
				const arrIndex = modelValueProps.findIndex((i) => {
					return i == value
				})
				modelValueProps.splice(arrIndex, 1)
				props.updateModelValue && props.updateModelValue(modelValueProps);
			}
			else {
				modelValueProps.splice(index, 0, value)
				props.updateModelValue && props.updateModelValue(modelValueProps);
			}
		}
	}


	/** SELECTED ITEM */
	const [active, setActive] = useState(false);


	/** CHECK SELECTED ITEM */

	const isSelected = (value: any) => {
		if (!props.multiple) {
			return props.modelValue === value
		}
		else {
			if (Array.isArray(props.modelValue)) {
				return props.modelValue.includes(value)
			}
		}
	}

	return (
		// Container
		<AppFormContainer
			{...containerProps()}
			onClick={() => !props.disabled && setActive(!active)}
		>
			{/* Input */}
			<div className="flex-grow flex items-center">
				{/* Chip */}
				{props.chip && (
					<div className="w-full flex-grow">
						<input
							defaultValue={filteredModelValue()}
							className="sr-only w-full flex-grow"
						/>
						{/* Placeholder */}
						{(!filteredModelValue() || !filteredModelValue()?.length) && (
							<div
								className="text-gray-400 w-full flex-grow"
							>
								{props.placeholder}
							</div>
						)}
						{/* Multiple */}
						{filteredModelValue() && Array.isArray(filteredModelValue()) && (
							<div
								className="flex flex-wrap gap-1.5 w-full flex-grow"
							>
								{(filteredModelValue() as string[]).map((item: any, key: any) => {
									return (
										<AppChip
											key={key}
											size={props.size}
											color={props.color}
										>
											{item}
										</AppChip>
									)
								})}
							</div>
						)}
						{/* Single */}
						{filteredModelValue() && !Array.isArray(filteredModelValue()) && (
							<AppChip
								size={props.size}
								color={props.color}
							>
								{filteredModelValue()}
							</AppChip>
						)}
					</div>
				)}
				{/* Text */}
				{!props.chip && (
					<input
						defaultValue={filteredModelValue()}
						className={`
							outline-none bg-transparent
							${props.inputClass}
							${props.block ? 'w-full' : ''}
						`}
						placeholder={props.placeholder}
						readOnly
					/>
				)}
			</div>
			{/* Arrow */}
			<div
				className="flex-shrink text-gray-400 pl-3"
			>
				<ChevronDownIcon
					className={`
						h-5 w-5 transition-transform duration-200 ease-in-out self-start
						${active ? 'rotate-180' : ''}
					`}
				>
				</ChevronDownIcon>
			</div>
			{/* Dropdown */}
			{active && (
				<div
					className="rounded absolute left-0 top-full border w-full z-40 mt-1.5 bg-white border-gray-300 dark:bg-gray-800 dark:border-gray-600"
				>
					{filteredItems().length
						? (<ul
								className="max-h-[176px]"
							>
								{filteredItems().map((item, key) =>
									<li
										key={key}
										className={`
											px-3 py-2.5 text-base w-full text-start cursor-pointer border-transparent first:rounded-t last:rounded-b
											${isSelected(item.value)
												? `bg-${props.color}/40 hover:bg-${props.color}/60 dark:bg-${props.color}/80 dark:hover:bg-${props.color}/60`
												: 'bg-white hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700'}
										`}
										onClick={()=>updateModelValue(item.value, key)}
									>
										{item.text}
									</li>
								)}
							</ul>)
						: (<div
								className="px-3 py-2.5 text-base w-full text-start text-gray-400"
							>
								{props.emptyText}
							</div>)
					}
				</div>
			)}
		</AppFormContainer>
	);
}

// Types
export type SelectSize = 'xs'|'sm'|'md'|'lg'|'xl'

export interface Prop extends HtmlHTMLAttributes<unknown> {
	modelValue?: string|string[]
	updateModelValue?: (value: string|string[])=>void
	items?: OptionProp[]|string[]
	multiple?: boolean
	chip?: boolean
	emptyText?: string
	inputClass?: ClassBinding
	/** Form Container */
	required?: boolean
	color?: TailwindColor
	error?: boolean
	success?: boolean
	label?: string
	message?: string
	disabled?: boolean
	size?: SelectSize
	variant?: InputVariant
	float?: boolean
	block?: boolean
}

