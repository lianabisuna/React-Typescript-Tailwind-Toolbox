// Imports
import { AppButton } from "@/components/app";
import { OptionProp } from "@/components/app/types";
import { useNavStore, useToolbarStore } from "@/stores";
import { ToolbarItemsProp } from "@/stores/toolbarStore";
import * as HeroIcons from '@heroicons/react/24/outline'
import {
	Bars3Icon,
	ChevronDownIcon,
	CubeIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	DevicePhoneMobileIcon,
	DeviceTabletIcon,
	ComputerDesktopIcon
} from "@heroicons/react/24/outline";
import { type SetStateAction, createContext, useContext, useState, type Dispatch } from "react";
import { Outlet } from "react-router-dom";

// Provider
const SidebarContext = createContext<SidebarContext|undefined>(undefined);

export default function LayoutDashboard() {
	const [sidebar, setSidebar] = useState<boolean|null>(null);
  const menu = useNavStore((state) => state.menu);

	return (
		<SidebarContext.Provider value={{sidebar, setSidebar}}>
			<main className="flex flex-col w-full">
				<Header />
				<div className="flex flex-1">
					<Outlet />
					<Sidebar />
				</div>
				<Footer />
				{menu && <Menu />}
			</main>
			</SidebarContext.Provider>
	);
}

// Types
interface SidebarContext {
  sidebar: boolean|null;
  setSidebar: Dispatch<SetStateAction<boolean|null>>;
}

function Header() {
	const sidebarContext = useContext(SidebarContext);
	const setSidebar = sidebarContext ? sidebarContext.setSidebar : ()=>({});
	const sidebar = sidebarContext ? sidebarContext.sidebar : false;

  const menu = useNavStore((state: { menu: boolean }) => state.menu);
  const setMenu = useNavStore((state) => state.setMenu);

	return (
		<header className="flex items-center justify-between h-14 w-full bg-[#111111] px-3">
			<ul className="flex gap-3 items-center">
				<li>
					<button
						className="aspect-square p-2 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 animate-glow active:opacity-80 rounded"
					>
						<CubeIcon className="h-5 w-5 text-white" />
					</button>
				</li>
				<li>
					<AppButton
						size="sm"
						color="eerie"
						tone="dark"
						onClick={()=>setMenu(!menu)}
					>
						<span>Button</span>
						<ChevronDownIcon className="h-3 w-3 ml-3 path-stroke-2" />
					</AppButton>
				</li>
			</ul>
			<ul className="flex gap-3">
				<li>
					<AppButton
						icon
						size="xs"
						color="eerie"
						tone="dark"
						variant={sidebar?'solid':'text'}
						onClick={()=>setSidebar(!sidebar)}
					>
						<Bars3Icon
							className={`
								h-5 w-5 transform duration-200 path-stroke-2
								${sidebar ? 'rotate-90' : ''}
							`}
						/>
					</AppButton>
				</li>
			</ul>
		</header>
	);
}

function Sidebar() {
	const sidebarContext = useContext(SidebarContext);
	const sidebar = sidebarContext ? sidebarContext.sidebar : false;


	/** HANDLE TOOLBAR ITEMS */

	const items = useToolbarStore((state) => state.items);
	const setValue = useToolbarStore((state) => state.setValue);


	/** TOOLBAR ITEM COMPONENT */

	function ToolbarItem<P extends string=''>(params: ToolbarItemsProp<P>) {
		const { type, prop, value } = params;
		const filteredOptions = () => {
			const _options = 'options' in params ? [ ...params.options as OptionProp[] ] : [];
			return _options?.map((option: OptionProp) => {
				if (typeof option === 'string')
					return { text: option, value: option }
				else
					return option
			})
		};

		const colors = [
			'blue-500',
			'red-500',
			'green-500',
			'amber-500',
			'indigo-500',
			'pink-500',
			'purple-500',
			'lime-500',
			'yellow-500',
			'rose-500',
			'emerald-500',
			'fuchsia-500',
		];

		switch (type) {
			case 'input':
				return (
					<input
						type="text"
						className="outline-none bg-eerie w-full px-3 py-2 rounded text-white font-medium"
						value={`${value}`}
						onChange={(e)=>setValue(prop, e.target.value)}
					/>
				);
			case 'select':
				return (
					<select
						value={`${value}`}
						onChange={(e)=>setValue(prop, e.currentTarget.value)}
						className="outline-none bg-eerie w-full px-2 py-2 rounded text-white font-medium"
					>
						{filteredOptions()?.map((option, key) => <option key={key} value={option.value}>{option.text}</option>)}
					</select>
				);
			case 'toggle':
				return (
					<div className="grid grid-cols-2 gap-0.5 rounded bg-eerie p-0.5">
						<button
							className={`${value ? 'bg-neutral-500' : 'bg-transparent'} text-white rounded placeholder:before:font-medium py-1.5`}
							onClick={()=>setValue(prop, true)}
						>
							Yes
						</button>
						<button
							className={`${value ? 'bg-transparent' : 'bg-neutral-500'} text-white rounded font-medium py-1.5`}
							onClick={()=>setValue(prop, false)}
						>
							No
						</button>
					</div>
				);
			case 'segment':
				return (
					<div className={`grid grid-cols-${filteredOptions() ? filteredOptions().length : 'none'} gap-0.5 rounded bg-eerie p-0.5`}>
						{filteredOptions()?.map((option, key) => {
							return (
								<button
									key={key}
									className={`${value===option.value ? 'bg-neutral-500' : 'bg-transparent'} text-white rounded font-medium py-1.5`}
									onClick={()=>setValue(prop, `${option.value}`)}
								>
									{option.text}
								</button>
							)
						})}
					</div>
				);
				case 'color':
					return (
						<div className="grid grid-cols-6 gap-1.5">
								{colors.map((color, key) => {
									return (
										<button
											key={key}
											className={`${value===color ? 'border-2 border-battle' : ''} rounded-full p-0.5 h-8 w-8`}
											onClick={()=>setValue(prop, `${color}`)}
										>
											<div
												className={`bg-${color} rounded-full aspect-square`}
											>
											</div>
										</button>
									)
								})}
							</div>
					);
					case 'icon':
						return (
							<div className="grid grid-cols-8 bg-red-100 gap-1.5">
								Icon
							</div>
						);
			default:
				break;
		}
	}

	return (
		<aside
			className={`
				xs:w-80 xs:border-0 absolute z-40 inset-y-0 right-0 w-full shrink-0 md:static md:border-t md:border-[#252525] bg-[#111111] p-3 flex flex-col gap-3
				${sidebar ? '' : 'max-w-0'}
			`}
		>
			{items?.map((item, key) => {
				return (
					<div key={key} className="grid grid-cols-3">
						<div className="col-span-1 text-sm font-medium text-battle flex items-center">{item.title}</div>
						<div className="col-span-2">
							{ToolbarItem(item)}
						</div>
					</div>
				)
			})}
			{/* <div className="grid grid-cols-3">
				<div className="col-span-1 text-sm font-medium text-battle flex items-center">Value</div>
				<div className="col-span-2">
					<input
						type="text"
						className="outline-none bg-eerie w-full px-3 py-2 rounded text-white"
						value={input}
						onChange={(e)=>setInput(e.target.value)}
					/>
				</div>
			</div>
			<div className="grid grid-cols-3">
				<div className="col-span-1 text-sm font-medium text-battle flex items-center">Variant</div>
				<div className="col-span-2">
					<select
						value={select}
						onChange={handleChange}
						className="outline-none bg-eerie w-full px-2 py-2 rounded text-white"
					>
						{options?.map((option, key) => <option key={key} value={option.value}>{option.text}</option>)}
					</select>
				</div>
			</div> */}
		</aside>
	);
}

function Footer() {
	const [active, setActive] = useState(false);

	return (
		<div className="fixed bg-[#111111] rounded h-14 bottom-5 left-1/2 -translate-x-1/2 flex justify-center items-center px-3">
			<ul className="flex gap-3">
				<li>
					<AppButton
						icon
						size="xs"
						color="eerie"
						tone="dark"
						variant="text"
					>
						<ChevronLeftIcon className="h-5 w-5" />
					</AppButton>
				</li>
				<li>
					<AppButton
						icon
						size="xs"
						color="eerie"
						tone="dark"
						variant={active?'solid':'text'}
						onClick={()=>setActive(!active)}
					>
						<DevicePhoneMobileIcon className="h-5 w-5" />
					</AppButton>
				</li>
				<li>
					<AppButton
						icon
						size="xs"
						color="eerie"
						tone="dark"
						variant={active?'solid':'text'}
						onClick={()=>setActive(!active)}
					>
						<ComputerDesktopIcon className="h-5 w-5" />
					</AppButton>
				</li>
				<li>
					<AppButton
						icon
						size="xs"
						color="eerie"
						tone="dark"
						variant={active?'solid':'text'}
						onClick={()=>setActive(!active)}
					>
						<DeviceTabletIcon className="h-5 w-5" />
					</AppButton>
				</li>
				<li>
					<AppButton
						icon
						size="xs"
						color="eerie"
						tone="dark"
						variant="text"
					>
						<ChevronRightIcon className="h-5 w-5" />
					</AppButton>
				</li>
			</ul>
		</div>
	);
}

function Menu() {
	const menuItems = [
		{
			title: 'Actions',
			icon: 'CursorArrowRaysIcon',
			items: [
				{ component: 'Button', to: '/' },
				{ component: 'Button Group', to: '/' },
				{ component: 'Accordion', to: '/' },
				{ component: 'Pagination', to: '/' },
				{ component: 'Breadcrumb', to: '/' },
				{ component: 'Speed Dial', to: '/' },
			],
		},
		{
			title: 'Text Inputs',
			icon: 'LanguageIcon',
			items: [
				{ component: 'Input', to: '/' },
				{ component: 'Textarea', to: '/' },
				{ component: 'File', to: '/' },
				{ component: 'Dropzone', to: '/' },
				{ component: 'OTP', to: '/' },
				{ component: 'Rating', to: '/' },
			],
		},
		{
			title: 'Communication',
			icon: 'SignalIcon',
			items: [
				{ component: 'Badge', to: '/' },
				{ component: 'Progress Bar', to: '/' },
				{ component: 'Spinner', to: '/' },
				{ component: 'Toast', to: '/' },
				{ component: 'Alert', to: '/' },
				{ component: 'Notification', to: '/' },
				{ component: 'Stepper', to: '/' },
				{ component: 'Skeleton', to: '/' },
			],
		},
		{
			title: 'Containment',
			icon: 'Square2StackIcon',
			items: [
				{ component: 'Card', to: '/' },
				{ component: 'Tooltip', to: '/' },
				{ component: 'Popover', to: '/' },
				{ component: 'Modal', to: '/' },
				{ component: 'Sheet', to: '/' },
				{ component: 'List Group', to: '/' },
				{ component: 'Carousel', to: '/' },
				{ component: 'Table', to: '/' },
				{ component: 'Form', to: '/' },
			],
		},
		{
			title: 'Navigation',
			icon: 'MapPinIcon',
			items: [
				{ component: 'Tab', to: '/' },
				{ component: 'Search', to: '/' },
				{ component: 'Navigation Drawer', to: '/' },
				{ component: 'Floating Label', to: '/' },
				{ component: 'Avatar', to: '/' },
				{ component: 'Keyboard', to: '/' },
				{ component: 'Timeline', to: '/' },
			],
		},
		{
			title: 'Selection',
			icon: 'ListBulletIcon',
			items: [
				{ component: 'Checkbox', to: '/' },
				{ component: 'Chip', to: '/' },
				{ component: 'Date Picker', to: '/' },
				{ component: 'Time Picker', to: '/' },
				{ component: 'Radio Button', to: '/' },
				{ component: 'Dropdown', to: '/' },
				{ component: 'Range', to: '/' },
				{ component: 'Switch', to: '/' },
				{ component: 'Select', to: '/' },
			],
		},
	] as const;

	const DynamicHeroIcon = ({ icon }: IconProps) => {
		const SingleIcon = HeroIcons[icon];

		return (
			<SingleIcon className="h-5 w-5 text-white mr-1.5" />
		);
	};

	return (
	<div className="bg-[#111111] absolute top-14 left-0 w-full flex-1 h-[calc(100%-3.5rem)] border-t border-[#252525] py-5 z-50 grid grid-cols-4 overflow-y-auto overflow-x-hidden scrollbar gap-3">
			{menuItems.map((menuItem,key) =>
				<div key={key}>
					<div className="flex mb-3 px-6">
						<DynamicHeroIcon icon={menuItem.icon} />
						<p className="text-white text-sm font-medium">{menuItem.title}</p>
					</div>
					<ul className="flex flex-col">
						{menuItem.items.map((item) =>
							<li>
								<button className={`
									py-2 rounded text-sm font-medium mx-3 px-3 w-full text-start
									${item.component==='Button' ? 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 animate-glow text-white' : 'text-battle hover:text-white'}
								`}>
									{item.component}
								</button>
							</li>
						)}
					</ul>
				</div>
			)}
		</div>
	);
}

type IconName = keyof typeof HeroIcons;
interface IconProps {
	icon: IconName;
}