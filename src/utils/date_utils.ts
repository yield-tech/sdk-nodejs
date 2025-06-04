export function formatDateISO(year: number, month: number, day: number) {
    let yyyy = year.toString().padStart(4, "0");
    let mm = month.toString().padStart(2, "0");
    let dd = day.toString().padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;
}
