export default function HomeHowItWorks() {
  const steps = [
    { title: 'Create account', desc: 'Aliquam facilisis egestas sapien, nec tempor leo tristique at.', icon: userIcon() },
    { title: 'Upload CV/Resume', desc: 'Curabitur sit amet maximus ligula. Nam a nulla ante. Nam sodales', icon: uploadIcon() },
    { title: 'Find suitable job', desc: 'Phasellus quis eleifend ex. Morbi nec fringilla nibh.', icon: searchIcon() },
    { title: 'Apply job', desc: 'Curabitur sit amet maximus ligula. Nam a nulla ante, Nam sodales purus.', icon: badgeIcon() },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h3 className="text-2xl font-semibold text-center mb-10">How HireHub work</h3>

        <div className="relative flex items-center justify-between gap-6">
          {steps.map((s, i) => (
            <div key={i} className="relative flex-1 flex items-start flex-col">
              <div className={`w-full p-6 rounded-lg shadow-sm bg-white text-center ${
                i === 1 ? 'scale-105 border' : ''
              }`}>
                <div className="flex items-center justify-center mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${i === 1 ? 'bg-blue-600 text-white' : 'bg-white border'}`}>
                    <span aria-hidden className="inline-block">{s.icon}</span>
                  </div>
                </div>
                <h4 className="font-medium mb-2">{s.title}</h4>
              </div>

              {i < steps.length - 1 && (
                <div className="hidden md:block absolute right-[-50%] top-1/2 transform translate-y-[-50%] w-[50%] h-0 pointer-events-none">
                  <svg width="100%" height="40" viewBox="0 0 200 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="overflow-visible">
                    <path d="M0 20 C60 20 140 20 200 20" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="6 6" fill="none" />
                    <path d="M195 16 L200 20 L195 24" fill="#cbd5e1" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function userIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5z"/><path d="M3 21v-1c0-2.8 4.5-5 9-5s9 2.2 9 5v1"/></svg>
  );
}
function uploadIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15v4a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-4"/><path d="M17 8l-5-5-5 5"/><path d="M12 3v12"/></svg>
  );
}
function searchIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 21l-4.35-4.35"/><circle cx="11" cy="11" r="6"/></svg>
  );
}
function badgeIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2l3 6 6 .5-4.5 3.8L18 20l-6-3-6 3 .5-7.7L2 8.5 8 8z"/></svg>
  );
}