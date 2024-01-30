const sortByCriteria = (students, sortCriteria, sortDirection) => {
    console.log('students:',students)
    const zorOrder = ['Unmotivated', 'Wiggly', 'Ready to Learn', 'Explosive'];

    const sortedStudents = [...students].sort((a, b) => {
        if (sortCriteria === 'lastName') {
            return sortDirection === 'desc'
                ? a.lastName.localeCompare(b.lastName)
                : b.lastName.localeCompare(a.lastName);
        } else if (sortCriteria === 'zor') {
            const zorA = a.journalEntries[a.journalEntries.length - 1]?.checkout?.ZOR || a.journalEntries[a.journalEntries.length - 1]?.checkin?.ZOR;
            const zorB = b.journalEntries[b.journalEntries.length - 1]?.checkout?.ZOR || b.journalEntries[b.journalEntries.length - 1]?.checkin?.ZOR;

            const indexA = zorOrder.indexOf(zorA);
            const indexB = zorOrder.indexOf(zorB);


            if (indexA === -1 && indexB === -1) {
                return 0;
            } else if (indexA === -1) {
                return 1;
            } else if (indexB === -1) {
                return -1;
            } else {
                return indexA - indexB;
            }
        }

        return 0;
    });

    if (sortCriteria === 'zor' && sortDirection === 'desc') {
        sortedStudents.reverse();
    }
console.log(sortedStudents)
    return sortedStudents;
};

module.exports = sortByCriteria;