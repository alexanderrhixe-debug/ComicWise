declare module "@react-email/components" {
  import { CSSProperties, ReactElement } from "react";

  // Render function
  export function render(
    component: ReactElement,
    options?: {
      pretty?: boolean;
      plainText?: boolean;
    }
  ): Promise<string>;

  // Html component
  export interface HtmlProps {
    lang?: string;
    dir?: "ltr" | "rtl";
    children?: React.ReactNode;
  }
  export function Html(props: HtmlProps): ReactElement;

  // Head component
  export interface HeadProps {
    children?: React.ReactNode;
  }
  export function Head(props: HeadProps): ReactElement;

  // Preview component
  export interface PreviewProps {
    children?: string;
  }
  export function Preview(props: PreviewProps): ReactElement;

  // Body component
  export interface BodyProps {
    style?: CSSProperties;
    children?: React.ReactNode;
  }
  export function Body(props: BodyProps): ReactElement;

  // Container component
  export interface ContainerProps {
    style?: CSSProperties;
    children?: React.ReactNode;
  }
  export function Container(props: ContainerProps): ReactElement;

  // Section component
  export interface SectionProps {
    style?: CSSProperties;
    children?: React.ReactNode;
  }
  export function Section(props: SectionProps): ReactElement;

  // Row component
  export interface RowProps {
    style?: CSSProperties;
    children?: React.ReactNode;
  }
  export function Row(props: RowProps): ReactElement;

  // Column component
  export interface ColumnProps {
    style?: CSSProperties;
    children?: React.ReactNode;
  }
  export function Column(props: ColumnProps): ReactElement;

  // Text component
  export interface TextProps {
    style?: CSSProperties;
    children?: React.ReactNode;
  }
  export function Text(props: TextProps): ReactElement;

  // Heading component
  export interface HeadingProps {
    as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    style?: CSSProperties;
    children?: React.ReactNode;
  }
  export function Heading(props: HeadingProps): ReactElement;

  // Button component
  export interface ButtonProps {
    href?: string;
    style?: CSSProperties;
    children?: React.ReactNode;
    target?: string;
  }
  export function Button(props: ButtonProps): ReactElement;

  // Link component
  export interface LinkProps {
    href?: string;
    style?: CSSProperties;
    children?: React.ReactNode;
    target?: string;
  }
  export function Link(props: LinkProps): ReactElement;

  // Img component
  export interface ImgProps {
    src?: string;
    alt?: string;
    width?: number | string;
    height?: number | string;
    style?: CSSProperties;
  }
  export function Img(props: ImgProps): ReactElement;

  // Hr component
  export interface HrProps {
    style?: CSSProperties;
  }
  export function Hr(props: HrProps): ReactElement;

  // Font component
  export interface FontProps {
    fontFamily?: string;
    fallbackFontFamily?: string;
    webFont?: {
      url: string;
      format: string;
    };
    fontWeight?: number;
    fontStyle?: string;
  }
  export function Font(props: FontProps): ReactElement;

  // Tailwind component
  export interface TailwindProps {
    children?: React.ReactNode;
    config?: Record<string, unknown>;
  }
  export function Tailwind(props: TailwindProps): ReactElement;

  // Code component
  export interface CodeProps {
    style?: CSSProperties;
    children?: string;
    language?: string;
  }
  export function Code(props: CodeProps): ReactElement;

  // CodeBlock component
  export interface CodeBlockProps {
    code: string;
    language?: string;
    theme?: "light" | "dark";
    style?: CSSProperties;
  }
  export function CodeBlock(props: CodeBlockProps): ReactElement;

  // Markdown component
  export interface MarkdownProps {
    children?: string;
    markdownCustomStyles?: Record<string, CSSProperties>;
    markdownContainerStyles?: CSSProperties;
  }
  export function Markdown(props: MarkdownProps): ReactElement;
}
