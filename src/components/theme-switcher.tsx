"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [checked, setChecked] = React.useState(theme === 'dark');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setChecked(isChecked);
    setTheme(isChecked ? 'dark' : 'light');
  }

  React.useEffect(() => {
    setChecked(theme === 'dark');
  }, [theme]);

  return (
    <div className="btn-container">
        <Sun className="h-[23px] w-[23px] text-muted-foreground" />
 		<label className="switch btn-color-mode-switch">
 		    <input value="1" id="color_mode" name="color_mode" type="checkbox" checked={checked} onChange={handleChange} />
 		    <label className="btn-color-mode-switch-inner" data-off="Light" data-on="Dark" htmlFor="color_mode"></label>
 		</label>
        <Moon className="h-[23px] w-[23px] text-muted-foreground" />
 	</div>
  )
}
