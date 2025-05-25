import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { orderAction } from '../../store/OrdersSlice';
import classes from './Orders.module.css';

const Orders = () => {
    const dispatch = useDispatch();
    const orders = useSelector(state => state.order.orders);
    
    useEffect(() => {
        getData();
        const interval = setInterval(() => {
            getData();
        }, 5000);
        return () => clearInterval(interval);
    }, [dispatch]);

    async function getData() {
        try {
            const response = await axios.get(`https://restaurant-user-panel-default-rtdb.firebaseio.com/orders.json`);
            
            if (response.data) {
                // Format orders from response data
                const formattedOrders = Object.keys(response.data).reduce((acc, email) => {
                    acc[email] = Object.keys(response.data[email]).map(orderId => {
                        const nestedorderObj = response.data[email][orderId];
                        const nestedKey = Object.keys(nestedorderObj)[0];
                        const findOrder = nestedorderObj[nestedKey];
                        console.log(findOrder);
                       return {
                          id : orderId,
                          firebaseId : nestedKey,
                          ...findOrder,
                       }
                    })
                    return acc;
                }, {});
               
                console.log(formattedOrders);

                dispatch(orderAction.addOrder(formattedOrders));
            } else {
                dispatch(orderAction.clearOrders());
            }
        } catch (err) {
            console.log(err);
        }
    }

  
    async function updateOrderStatus(orderId, status, userEmail) {

        const targetOrder = orders[userEmail].find(order=>order.id === orderId);

        if(!targetOrder) return;

        const updatedOrder = { status };

        try {
            // Use PATCH to update only the 'status' field in the specific user's order
            await axios.patch(
                `https://restaurant-user-panel-default-rtdb.firebaseio.com/orders/${userEmail}/${orderId}/${targetOrder.firebaseId}.json`,
                updatedOrder
            );

            // Optimistic UI update
            const updatedOrders = { ...orders };
            updatedOrders[userEmail] = updatedOrders[userEmail].map(order =>
                order.id === orderId ? { ...order, status } : order
            );
            dispatch(orderAction.addOrder(updatedOrders));
        } catch (err) {
            console.log(err.message);
        }
    }

  
    return (
        <div className={classes.ordersContainer}>
            <h1 className={classes.title}>Orders</h1>
            <div className={classes.orderList}>
                {Object.keys(orders).length > 0 ? (
                    Object.keys(orders).map(userEmail => (
                        orders[userEmail].map((order) => (
                            <div key={order.id} className={classes.orderCard}>
                                <div className={classes.orderHeader}>
                                    <h3>Order ID: {order.id}</h3>
                                    <span>Status: {order.status}</span>
                                </div>

                                <div className={classes.orderDetails}>
                                    <p>
                                        <strong>Address:</strong> {order.address}
                                    </p>
                                    <p>
                                        <strong>Payment Method:</strong> {order.paymentMethod}
                                    </p>
                                </div>

                                <div className={classes.itemsList}>
                                    <h4>Items:</h4>
                                    <ul>
                                        {order.items &&
                                            order.items.map((item) => (
                                                <li key={item.id}>
                                                    {item.recipeName} - {item.quantity} x ${item.price} = ${item.totalPrice}
                                                </li>
                                            ))}
                                    </ul>
                                </div>

                                <div className={classes.statusSelect}>
                                    <select
                                        value={order.status}
                                        onChange={(e) => updateOrderStatus(order.id, e.target.value, userEmail)}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Prepared">Prepared</option>
                                        <option value="Delivered">Delivered</option>
                                    </select>
                                </div>
                            </div>
                        ))
                    ))
                ) : (
                    <p>No orders available.</p>
                )}
            </div>
        </div>
    );
};

export default Orders;











// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import axios from 'axios';
// import { orderAction } from '../../store/OrdersSlice';
// import classes from './Orders.module.css';

// const Orders = () => {
//     const dispatch = useDispatch();
//     const orders = useSelector(state => state.order.orders);

//     useEffect(() => {
//         getData();
//         const interval = setInterval(() => {
//             getData();
//         }, 5000);
//         return () => clearInterval(interval);
//     }, [dispatch]);

//     async function getData() {
//         try {
//             const response = await axios.get(`https://restaurant-user-panel-default-rtdb.firebaseio.com/orders.json`);
//             console.log(response.data);
//             if (response.data) {
//                 const formattedOrders = Object.keys(response.data).reduce((acc,email)=>
//                 acc[email] = Object.keys(response.data[email])).map((orderId) => ({
//                     id: orderId,
//                     ...response.data[orderId]
//                 }));
//                 dispatch(orderAction.addOrder(formattedOrders));
//             } else {
//                 dispatch(orderAction.clearOrders());
//             }
//         } catch (err) {
//             console.log(err);
//         }
//     }

//     async function updateOrderStatus(orderId, status) {


//         const updatedOrder = { status }; // Only send the status field

//   try {
//     // Use PATCH to update only the 'status' field
//     await axios.patch(
//       `https://restaurant-user-panel-default-rtdb.firebaseio.com/orders/${orderId}.json`,
//       updatedOrder
//     );

//     // Optimistic UI update
//     const updatedOrders = orders.map((order) =>
//       order.id === orderId ? { ...order, status } : order
//     );
//     dispatch(orderAction.addOrder(updatedOrders));

//         // try {
//         //     dispatch(orderAction.updateOrderStatus({ orderId, status }));

//         //     await axios.patch(`https://restaurant-user-panel-default-rtdb.firebaseio.com/orders/${orderId}.json`, { status });

//         // } catch (err) {
//         //     console.log(err);
//         // }
//         // const updatedOrders = orders.map((order) =>
//         //     order.id === orderId ? { ...order, status } : order
//         //   );
//         //   dispatch(orderAction.addOrder(updatedOrders));

//         // try {
//         //     const orderResponse = await axios.get(`https://restaurant-user-panel-default-rtdb.firebaseio.com/orders/${orderId}.json`);
//         //     const orderData = orderResponse.data;

//         //     // Replace only the status field while keeping the other fields intact
//         //     const updatedOrder = { ...orderData, status };

//         //     await axios.put(`https://restaurant-user-panel-default-rtdb.firebaseio.com/orders/${orderId}.json`, updatedOrder);

//         //     getData();  // Fetch the updated orders
//         } catch (err) {
//             console.log(err.message);
//         }
//     }

//     return (
//         <div className={classes.ordersContainer}>
//             <h1 className={classes.title}>Orders</h1>
//             <div className={classes.orderList}>
//                 {Array.isArray(orders) && orders.length > 0 ? (
//                     orders.map((order) => (
//                         <div key={order.id} className={classes.orderCard}>
//                             <div className={classes.orderHeader}>
//                                 <h3>Order ID: {order.id}</h3>
//                                 <span>Status: {order.status}</span>
//                             </div>

//                             <div className={classes.orderDetails}>
//                                 <p>
//                                     <strong>Address:</strong> {order.address}
//                                 </p>
//                                 <p>
//                                     <strong>Payment Method:</strong> {order.paymentMethod}
//                                 </p>
//                             </div>

//                             <div className={classes.itemsList}>
//                                 <h4>Items:</h4>
//                                 <ul>
//                                     {order.items &&
//                                         order.items.map((item) => (
//                                             <li key={item.id}>
//                                                 {item.recipeName} - {item.quantity} x ${item.price} = ${item.totalPrice}
//                                             </li>

//                                         ))}
//                                 </ul>
//                             </div>

//                             <div className={classes.statusSelect}>
//                                 <select
//                                     value={order.status}
//                                     onChange={(e) => updateOrderStatus(order.id, e.target.value)}
//                                 >
//                                     <option value="Pending">Pending</option>
//                                     <option value="Prepared">Prepared</option>
//                                     <option value="Delivered">Delivered</option>
//                                 </select>
//                             </div>
//                         </div>
//                     ))
//                 ) : (
//                     <p>No orders available.</p>
//                 )}
//             </div>
//         </div>

//     );
// };

// export default Orders;
