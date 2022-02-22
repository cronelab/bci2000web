#include "PCHIncludes.h"
#pragma hdrstop

#include "ZMQFilter.h"


class ZMQContextOutputFilter : public ZMQFilter
{
public: ZMQContextOutputFilter() :
	ZMQFilter("Filtering:ContextOutput", "ContextOutput", 5556) { }
}; Filter(ZMQContextOutputFilter, 2.A3);