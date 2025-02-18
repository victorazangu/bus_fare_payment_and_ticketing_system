import { TrashIcon } from '@heroicons/react/24/outline/index.js';

const UserCard = ({ member, handleCardClick, handleUpdate, handleDelete }) => {
    const image = member.image ? `${member.image}` : '/storage/default.png';
    return (
        <div
            className="relative cursor-pointer overflow-hidden rounded-lg bg-gray-700 shadow-lg transition-transform hover:scale-105"
            onClick={() => handleCardClick(member.id)}
        >
            <div className="absolute right-2 top-2 space-x-2">
                {/*<button*/}
                {/*    onClick={(e) => {*/}
                {/*        e.stopPropagation();*/}
                {/*        handleUpdate(member.id);*/}
                {/*    }}*/}
                {/*    className="p-2 text-yellow-500 hover:text-yellow-700"*/}
                {/*>*/}
                {/*    <PencilIcon className="h-5 w-5" />*/}
                {/*</button>*/}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(member.id);
                    }}
                    className="p-2 text-red-500 hover:text-red-700"
                >
                    <TrashIcon className="h-5 w-5" />
                </button>
            </div>
            <img
                src={`/${image}`}
                alt={member.name}
                className="h-48 w-full object-cover"
            />

            <div className="p-4 text-center">
                <h2 className="text-xl font-bold text-white">{member.name}</h2>
                <p className="text-sm text-gray-300">{member.phone}</p>
                <p className="text-sm text-gray-400">{member.address}</p>
            </div>
        </div>
    );
};

export default UserCard;
