import { type User } from '../constants/users'

interface Props { user: User }

export function TripTab({ user }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 py-16">
      <span className="text-5xl">{user.emoji}</span>
      <p className="font-mono text-xs tracking-widest text-gray-600">TRIP TAB — COMING SOON</p>
    </div>
  )
}
