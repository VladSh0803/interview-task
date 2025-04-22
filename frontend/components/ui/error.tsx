export default function Error() {
    return (
        <div className="flex flex-col items-center justify-center gap-4 text-center p-6 rounded-xl border border-red-200 bg-red-50 text-red-700 shadow-sm">
            <h2 className="text-xl font-semibold">Oops!</h2>
            <p>Sorry, something went wrong. Try reloading page</p>
        </div>
    )
}
