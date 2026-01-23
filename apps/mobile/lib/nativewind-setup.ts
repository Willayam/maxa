import { cssInterop } from "nativewind";
import {
  H1,
  H2,
  H3,
  H4,
  H5,
  P,
  A,
  Header,
  Footer,
  Nav,
  Main,
  Section,
  Article,
} from "@expo/html-elements";

// Register @expo/html-elements with NativeWind so className works
cssInterop(H1, { className: "style" });
cssInterop(H2, { className: "style" });
cssInterop(H3, { className: "style" });
cssInterop(H4, { className: "style" });
cssInterop(H5, { className: "style" });
cssInterop(P, { className: "style" });
cssInterop(A, { className: "style" });
cssInterop(Header, { className: "style" });
cssInterop(Footer, { className: "style" });
cssInterop(Nav, { className: "style" });
cssInterop(Main, { className: "style" });
cssInterop(Section, { className: "style" });
cssInterop(Article, { className: "style" });
