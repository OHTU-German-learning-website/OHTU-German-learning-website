"use client";
import styles from "./dropdown.module.css";
import { DropdownMenu as _DropdownMenu } from "radix-ui";
import { z } from "zod";
import { useSchema } from "@/shared/hooks/useSchema";

const optionSchema = z.array(
  z.object({
    label: z.string(),
    value: z.string(),
    disabled: z.boolean().optional(),
  })
);

export const Dropdown = ({
  children,
  options,
  onSelect,
  contentProps,
  ...props
}) => {
  const validatedOptions = useSchema(options, optionSchema);

  const handleSelect = (value) => {
    onSelect?.(value);
  };

  const _contentProps = {
    sideOffset: 8,
    ...contentProps,
  };

  const renderOptions = () => {
    return validatedOptions.map((option) => (
      <_DropdownMenu.Item
        key={option.value}
        className={styles.item}
        onClick={() => handleSelect(option.value)}
      >
        {option.label}
      </_DropdownMenu.Item>
    ));
  };
  return (
    <_DropdownMenu.Root {...props}>
      <_DropdownMenu.Trigger asChild>{children}</_DropdownMenu.Trigger>
      <_DropdownMenu.Portal className={styles.portal}>
        <_DropdownMenu.Content className={styles.content} {..._contentProps}>
          {renderOptions()}
        </_DropdownMenu.Content>
      </_DropdownMenu.Portal>
    </_DropdownMenu.Root>
  );
};
