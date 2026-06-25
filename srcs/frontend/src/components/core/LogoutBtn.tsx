
import { fetchWithConfig } from "../../services/api"


const LogoutBtn = () => {
	return (
			<button onClick={async () => {
				try {
					await fetchWithConfig('/v1/logout', { method: 'POST' })
				} catch {
				}
				window.location.href = '/'
					}} className="font-['Fredoka',sans-serif] flex items-center gap-2.5 px-2.5 py-2 rounded-xl font-extrabold text-sm border-2 border-transparent shadow-[0_6px_14px_rgba(15,23,42,0.10)] transition-all cursor-pointer text-[#1e3a8a] bg-blue-50 hover:bg-blue-600 hover:text-blue-50 hover:border-blue-200">
						Logout
			</button>
	)
}

export default LogoutBtn
