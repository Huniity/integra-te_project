import HeroBrand from '../components/branding/HeroBrand'

/*
   Home page - root route "/"
   Sections to be added here as they are built:
     [ ] NavIconGrid   (main section icon cards - Giulio/Adrien)
     [ ] AboutTeaser   (Sobre o Projeto snippet)
     [ ] FundingBar    (EU / Portugal 2030 / Loulé logos -> Footer)
 */
export default function Home() {
  return (
    <main id="main-content">
      {/* Pass logoSrc="/logo.svg" and bgSrc="/hero.png" once assets land */}
      <HeroBrand />
    </main>
  )
}