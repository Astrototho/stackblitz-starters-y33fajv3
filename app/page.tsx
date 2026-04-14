import ActivityCard from '@/components/ActivityCard';
import { supabase } from '@/lib/supabase';
import PropositionForm from '@/components/PropositionForm';
import { auth } from '@/auth';
import { handleSignIn, handleSignOut } from '@/app/actions';

export const dynamic = 'force-dynamic';

export default async function Home() {
  // En local et sur Vercel, ça marche de manière instantanée et fluide !
  const session = await auth();

  const { data: activities, error } = await supabase
    .from('activities')
    .select('*')
    .order('start_date', { ascending: true });

  return (
    <main className="p-4 max-w-md mx-auto space-y-8">
      <header className="py-2 flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Perfconnect
          </h1>
          <p className="text-muted-foreground text-sm">
            Trouve ton partenaire.
          </p>
        </div>

        <div>
          {session?.user ? (
            <div className="flex items-center gap-3">
              <img
                src={session.user.image || 'https://github.com/shadcn.png'}
                className="w-9 h-9 rounded-full border border-gray-200 shadow-sm"
                alt="Avatar"
              />
              <form action={handleSignOut}>
                <button
                  type="submit"
                  className="text-xs font-bold text-gray-500 hover:text-black uppercase transition-colors"
                >
                  Sortir
                </button>
              </form>
            </div>
          ) : (
            <form action={handleSignIn}>
              <button
                type="submit"
                className="bg-[#fc4c02] hover:bg-[#e34402] text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-md transition-all"
              >
                Strava Login
              </button>
            </form>
          )}
        </div>
      </header>

      {session?.user ? (
        <PropositionForm />
      ) : (
        <div className="bg-orange-50 text-orange-900 p-6 rounded-2xl text-center text-sm border border-orange-100 font-medium">
          Connecte-toi avec Strava pour proposer une sortie.
        </div>
      )}

      <section className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span className="w-1.5 h-6 bg-[#fc4c02] rounded-full"></span>
          Sorties à proximité
        </h2>

        <div className="space-y-4">
          {activities?.map((act) => (
            <ActivityCard
              key={act.id}
              activity={{
                ...act,
                date: act.start_date,
                time: new Date(act.start_date).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
                user: {
                  name: 'Athlète',
                  avatar: 'https://github.com/shadcn.png',
                },
                participants: [],
              }}
            />
          ))}
          {(!activities || activities.length === 0) && (
            <p className="text-center py-10 text-gray-400 text-sm">
              Aucune sortie pour le moment...
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
