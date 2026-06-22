
import { fetchWithConfig } from "../../services/api"


const LogoutBtn = () => {
	return (
			<button onClick={async () => {
				try {
					await fetchWithConfig('/v1/logout', { method: 'POST' })
				} catch {
				}
				window.location.href = '/'
					}} className="font-['Fredoka',sans-serif] flex items-center gap-3 rounded-xl px-4 py-[clamp(0.375rem,1vh,0.625rem)] text-left lg:text-[clamp(1rem,1.6vh,1rem)] xl:text-[clamp(1.1rem,1.8vh,1.1rem)] 2xl:text-[clamp(1.2rem,2vh,1.2rem)] font-medium transition-colors text-white bg-blue-600/60 hover:bg-red-100">
						Logout
			</button>
	)
}

export default LogoutBtn
