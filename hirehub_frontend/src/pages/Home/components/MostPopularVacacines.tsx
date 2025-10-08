const sampleVacancies = [
        { title: 'Software Developer', count: '43,359' },
        { title: 'Data Scientist', count: '28,200' },
        { title: 'Financial Manager', count: '61,391' },
        { title: 'IT Manager', count: '50,963' },
        { title: 'Software Developer', count: '43,359' },
        { title: 'Data Scientist', count: '28,200' },
        { title: 'Financial Manager', count: '61,391' },
        { title: 'IT Manager', count: '50,963' }
    ];

export default function MostPopularVacacines() {
    return (
        <section className="max-w-7xl mx-auto px-6 py-12">
            <h2 className="text-2xl font-semibold mb-6">Most Popular Vacancies</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {sampleVacancies.map((v) => (
                <div key={v.title} className="bg-white rounded shadow p-4">
                <div className="font-medium text-gray-800">{v.title}</div>
                <div className="text-sm text-gray-500 mt-2">{v.count} Open Positions</div>
                </div>
            ))}
            </div>
        </section>
    );
}