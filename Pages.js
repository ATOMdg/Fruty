import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import { Pagination } from "react-bootstrap";

const Pages = observer(() => {
    const {place} = useContext(Context)
    const pageCount = Math.ceil(place.totalCount / place.limit) || 1;
    const pages = [];
    for (let i = 1; i <= pageCount; i++) {
        pages.push(i);
    }
    return (
        <Pagination className="mt-5">
            {pages.map(page => 
                <Pagination.Item 
                    key={page} 
                    active={place.page === page}
                    onClick={() => place.setPage(page)}
                >
                    {page}
                </Pagination.Item>
            )}
        </Pagination>
    )
})

export default Pages