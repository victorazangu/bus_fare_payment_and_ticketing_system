const UserCard = ({ member, handleCardClick }) => {
    const image = member.image ? `${member.image}` : '/storage/default.png';
    console.log('image ', member.image);
    return (
        <div
            className="cursor-pointer overflow-hidden rounded-lg bg-gray-700 shadow-lg transition-transform hover:scale-105"
            onClick={() => handleCardClick(member.id)}
        >
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
