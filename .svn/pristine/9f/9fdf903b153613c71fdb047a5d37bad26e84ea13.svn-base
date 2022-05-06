import React from "react";

// Comment này nhận 2 props là Data và Name từ component cha

export default function RenderListCylinder(props) {
	return (
		<div>
		{props.data.map((todo,index)=>{
			return(
				<div key={index}>
					<p className="title-item-render">
						<span>Loại bình: <span>{todo.key}</span> </span>
						<span >Số lượng: {(todo.values).length} </span>
					</p>
					<div>
						{todo.values.map((item, indexs) => {
							return (
								<p className="list-item-render" key={indexs}>
									<span>
										{indexs + 1}.{todo.key}
									</span>
									<span>{item.serialCylinder}</span>
									<span>
										{item.weightCylinder % 1 === 0
											? item.weightCylinder + ".0 Kg"
											: item.weightCylinder + " Kg"}
									</span>
									<span>
										{item.weightImport % 1 === 0
											? item.weightImport + ".0 Kg"
											: item.weightImport + " Kg"}
									</span>
								</p>
							);
						})}
					</div>
				</div>
			)
		})}
		</div>
	);
}
