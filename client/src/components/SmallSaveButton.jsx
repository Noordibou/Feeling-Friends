import Background from "../images/button.png"

export default function SmallSaveButton() {
    return (
        <div className="flex justify-center items-center">
        <button style={{ backgroundImage: `url('${Background}')` }} className="text-body text-[Poppins] rounded-xl px-[1rem] flex items-center w-[700px] h-[80px]">
            <h4 className="pr-2">Save</h4>
        </button>
        </div>
    );
}