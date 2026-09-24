import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, Router as WouterRouter } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import Preloader from "./components/Preloader";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { BakeryProvider } from "./lib/bakeryStore";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import CustomOrder from "./pages/CustomOrder";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Contact from "./pages/Contact";

const routerBase = import.meta.env.BASE_URL.replace(/\/$/, "");


function AppRoutes() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/menu"} component={Menu} />
      <Route path={"/custom-order"} component={CustomOrder} />
      <Route path={"/gallery"} component={Gallery} />
      <Route path={"/about"} component={About} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <BakeryProvider>
          <CartProvider>
            <FavoritesProvider>
              <TooltipProvider>
                <Toaster />
                <Preloader />
                <WouterRouter base={routerBase}><AppRoutes /></WouterRouter>
              </TooltipProvider>
            </FavoritesProvider>
          </CartProvider>
        </BakeryProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
