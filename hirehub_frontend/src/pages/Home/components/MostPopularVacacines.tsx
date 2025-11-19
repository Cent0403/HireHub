const sampleVacancies = [
        { id: 1, title: 'Software Developer', count: '43,359' },
        { id: 2, title: 'Data Scientist', count: '28,200' },
        { id: 3, title: 'Financial Manager', count: '61,391' },
        { id: 4, title: 'IT Manager', count: '50,963' },
        { id: 5, title: 'Software Developer', count: '43,359' },
        { id: 6, title: 'Data Scientist', count: '28,200' },
        { id: 7, title: 'Financial Manager', count: '61,391' },
        { id: 8, title: 'IT Manager', count: '50,963' }
    ];

export default function MostPopularVacacines() {
    return (
        <section className="max-w-7xl mx-auto px-6 py-12">
            <h2 className="text-2xl font-semibold mb-6">Most Popular Vacancies</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {sampleVacancies.map((v) => (
                <div key={v.id} className="bg-white rounded shadow p-4">
                <div className="font-medium text-gray-800">{v.title}</div>
                <div className="text-sm text-gray-500 mt-2">{v.count} Open Positions</div>
                </div>
            ))}
            </div>
        </section>
    );
}